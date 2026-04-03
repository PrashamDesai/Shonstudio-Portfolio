import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAdmin } from "../context/AdminContext.jsx";
import {
  deleteCachedApiResponse,
  readCachedApiResponse,
  writeCachedApiResponse,
} from "../utils/browserDb.js";
import { getApiBaseCandidates } from "../utils/apiBase.js";

const PUBLIC_API_BASE_CANDIDATES = getApiBaseCandidates();
const PUBLIC_API_TIMEOUT_MS = 60_000;
const MAX_REQUEST_ATTEMPTS = 1;
const RETRY_DELAY_MS = 250;
const CACHE_TTL_MS = 5 * 60_000;
// TEMPORARY TOOLS HOLD:
// Keep tools API disabled for now so no frontend request is sent to /tools.
// AI REVERT INSTRUCTIONS:
// 1) Set this constant to `false`.
// 2) Keep the early-return block below if you want a reusable feature flag,
//    or remove it entirely to restore original behavior.
const TEMP_DISABLE_TOOLS_API = true;

const responseCache = new Map();
const EMPTY_ARRAY = [];

const endpointFallbackMap = {
  "/team": ["/teams", "/team-members"],
};

const getCachedRecord = (key) => responseCache.get(key) || null;

const isCacheRecordFresh = (record) =>
  Boolean(record) && Date.now() - Number(record.timestamp || 0) < CACHE_TTL_MS;

const getCachedResponse = (key) => {
  const cachedRecord = getCachedRecord(key);

  if (!cachedRecord) {
    return null;
  }

  if (!isCacheRecordFresh(cachedRecord)) {
    responseCache.delete(key);
    return null;
  }

  return cachedRecord.data;
};

const setCachedResponse = (key, data) => {
  const record = {
    timestamp: Date.now(),
    data,
  };

  responseCache.set(key, record);
  void writeCachedApiResponse(key, data);
};

const clearResponseCache = (key) => {
  if (!key) {
    return;
  }

  responseCache.delete(key);
  void deleteCachedApiResponse(key);
};

const hydrateCachedResponse = async (key) => {
  const cachedData = getCachedResponse(key);

  if (cachedData !== null && cachedData !== undefined) {
    return cachedData;
  }

  const persistedRecord = await readCachedApiResponse(key);

  if (!persistedRecord) {
    return null;
  }

  if (!isCacheRecordFresh(persistedRecord)) {
    void deleteCachedApiResponse(key);
    return null;
  }

  responseCache.set(key, persistedRecord);
  return persistedRecord.data ?? null;
};

const extractRequestError = (requestError) => {
  if (axios.isCancel(requestError)) {
    return "";
  }

  const serverMessage = requestError?.response?.data?.message;
  if (typeof serverMessage === "string" && serverMessage.trim()) {
    return serverMessage;
  }

  if (requestError?.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (requestError?.message) {
    return requestError.message;
  }

  return "Unable to load content right now.";
};

const canTryNextApiBase = (requestError) => {
  if (!requestError || axios.isCancel(requestError)) {
    return false;
  }

  const status = Number(requestError?.response?.status || 0);
  return status === 0 || status >= 500;
};

const shouldRetryRequest = (requestError) => {
  if (!requestError || axios.isCancel(requestError)) {
    return false;
  }

  if (requestError?.code === "ECONNABORTED") {
    return true;
  }

  const status = Number(requestError?.response?.status || 0);
  return status === 0 || status === 429 || status >= 500;
};

const wait = (delayMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

const useApiRequest = (
  endpoint,
  {
    enabled = true,
    initialData,
    transform = (payload) => payload,
    suppressNotFoundError = false,
    timeoutMs = PUBLIC_API_TIMEOUT_MS,
  } = {},
) => {
  const { refreshVersion } = useAdmin();
  const previousRefreshVersion = useRef(refreshVersion);
  const [requestVersion, setRequestVersion] = useState(0);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [statusCode, setStatusCode] = useState(0);

  useEffect(() => {
    if (!endpoint) {
      previousRefreshVersion.current = refreshVersion;
      return;
    }

    if (previousRefreshVersion.current !== refreshVersion) {
      clearResponseCache(endpoint);
    }

    previousRefreshVersion.current = refreshVersion;
  }, [endpoint, refreshVersion]);

  useEffect(() => {
    if (!enabled || !endpoint) {
      setData(initialData);
      setLoading(false);
      setError("");
      setNotFound(false);
      setStatusCode(0);
      return undefined;
    }

    // TEMPORARY TOOLS HOLD:
    // Short-circuit tools requests so /tools API is never called.
    // AI REVERT INSTRUCTIONS:
    // - Remove this block OR set TEMP_DISABLE_TOOLS_API=false above.
    if (TEMP_DISABLE_TOOLS_API && endpoint.startsWith("/tools")) {
      setData(initialData);
      setLoading(false);
      setError("");
      setNotFound(false);
      setStatusCode(200);
      return undefined;
    }

    const cacheKey = endpoint;
    const immediateCachedData = getCachedResponse(cacheKey);
    const controller = new AbortController();
    let active = true;

    setError("");
    setNotFound(false);

    if (immediateCachedData !== null && immediateCachedData !== undefined) {
      setData(immediateCachedData);
      setLoading(false);
      setStatusCode(200);
      return () => {
        active = false;
        controller.abort();
      };
    }

    setData(initialData);
    setLoading(true);
    setStatusCode(0);

    const fetchData = async () => {
      const persistedCachedData = await hydrateCachedResponse(cacheKey);

      if (!active) {
        return;
      }

      if (persistedCachedData !== null && persistedCachedData !== undefined) {
        setData(persistedCachedData);
        setLoading(false);
        setStatusCode(200);
        return;
      }

      try {
        const endpointCandidates = [
          endpoint,
          ...(endpointFallbackMap[endpoint] || []),
        ];

        let response = null;
        let resolvedEndpoint = endpoint;
        let lastError = null;

        for (const candidate of endpointCandidates) {
          for (const apiBase of PUBLIC_API_BASE_CANDIDATES) {
            try {
              let candidateResponse = null;

              for (let attempt = 1; attempt <= MAX_REQUEST_ATTEMPTS; attempt += 1) {
                try {
                  candidateResponse = await axios.get(`${apiBase}${candidate}`, {
                    signal: controller.signal,
                    timeout: timeoutMs,
                  });
                  break;
                } catch (attemptError) {
                  if (axios.isCancel(attemptError)) {
                    throw attemptError;
                  }

                  const canRetry =
                    attempt < MAX_REQUEST_ATTEMPTS && shouldRetryRequest(attemptError);

                  if (canRetry) {
                    await wait(RETRY_DELAY_MS * attempt);
                    continue;
                  }

                  throw attemptError;
                }
              }

              response = candidateResponse;
              resolvedEndpoint = candidate;
              break;
            } catch (candidateError) {
              lastError = candidateError;

              if (axios.isCancel(candidateError)) {
                throw candidateError;
              }

              const status = Number(candidateError?.response?.status || 0);
              const isNotFound = status === 404;
              const shouldTryAnotherApiBase = canTryNextApiBase(candidateError);
              const isLastApiBase =
                apiBase === PUBLIC_API_BASE_CANDIDATES[PUBLIC_API_BASE_CANDIDATES.length - 1];

              if (!isLastApiBase && shouldTryAnotherApiBase) {
                continue;
              }

              if (!isNotFound || candidate === endpointCandidates[endpointCandidates.length - 1]) {
                throw candidateError;
              }
            }
          }

          if (response) {
            break;
          }
        }

        if (!response && lastError) {
          throw lastError;
        }

        if (!active) {
          return;
        }

        const nextData = transform(response.data);

        setData(nextData);
        setError("");
        setNotFound(false);
        setStatusCode(response.status || 200);
        setCachedResponse(cacheKey, nextData);

        if (resolvedEndpoint !== endpoint) {
          setCachedResponse(resolvedEndpoint, nextData);
        }
      } catch (requestError) {
        if (!active || axios.isCancel(requestError)) {
          return;
        }

        const responseStatus = Number(requestError?.response?.status || 0);
        const isNotFound = responseStatus === 404;

        setStatusCode(responseStatus);

        if (isNotFound && suppressNotFoundError) {
          setData(initialData);
          setError("");
          setNotFound(true);
          return;
        }

        const nextError = extractRequestError(requestError);
        setError(nextError);
        setNotFound(isNotFound);

        console.error(`[API] GET ${endpoint} failed`, {
          status: responseStatus || "network",
          message: nextError,
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    endpoint,
    enabled,
    initialData,
    refreshVersion,
    requestVersion,
    suppressNotFoundError,
    timeoutMs,
    transform,
  ]);

  const refetch = useCallback(() => {
    clearResponseCache(endpoint);
    setRequestVersion((value) => value + 1);
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    notFound,
    statusCode,
    refetch,
  };
};

export const useCollection = (endpoint, options = {}) => {
  const {
    initialData = EMPTY_ARRAY,
    enabled = true,
  } = options;

  const result = useApiRequest(endpoint, {
    enabled,
    initialData,
    transform: useCallback((payload) => (Array.isArray(payload) ? payload : []), []),
  });

  return useMemo(
    () => ({
      ...result,
      isEmpty: !result.loading && !result.error && Array.isArray(result.data) && !result.data.length,
    }),
    [result],
  );
};

export const useSingleton = (endpoint, options = {}) => {
  const {
    initialData = null,
    enabled = true,
  } = options;

  const result = useApiRequest(endpoint, {
    enabled,
    initialData,
    transform: useCallback(
      (payload) =>
        payload && typeof payload === "object" && !Array.isArray(payload)
          ? payload
          : initialData,
      [initialData],
    ),
  });

  return useMemo(
    () => ({
      ...result,
      isEmpty: !result.loading && !result.error && !result.data,
    }),
    [result],
  );
};

export const useItem = (endpoint, options = {}) => {
  const {
    enabled = true,
    initialData = null,
    timeoutMs = PUBLIC_API_TIMEOUT_MS,
  } = options;

  return useApiRequest(endpoint, {
    enabled,
    initialData,
    timeoutMs,
    suppressNotFoundError: true,
    transform: useCallback(
      (payload) =>
        payload && typeof payload === "object" && !Array.isArray(payload)
          ? payload
          : initialData,
      [initialData],
    ),
  });
};
