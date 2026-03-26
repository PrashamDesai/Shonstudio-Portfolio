import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdmin } from "../context/AdminContext.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

const CACHE_TTL_MS = 30_000;
const responseCache = new Map();
const EMPTY_ARRAY = [];

const getCachedResponse = (key) => {
  const cached = responseCache.get(key);

  if (!cached) {
    return null;
  }

  const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS;

  if (!isFresh) {
    responseCache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedResponse = (key, data) => {
  responseCache.set(key, {
    timestamp: Date.now(),
    data,
  });
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

const useApiRequest = (
  endpoint,
  {
    enabled = true,
    initialData,
    transform = (payload) => payload,
    suppressNotFoundError = false,
  } = {},
) => {
  const { refreshVersion } = useAdmin();
  const [requestVersion, setRequestVersion] = useState(0);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [statusCode, setStatusCode] = useState(0);

  useEffect(() => {
    if (!enabled || !endpoint) {
      setData(initialData);
      setLoading(false);
      setError("");
      setNotFound(false);
      setStatusCode(0);
      return undefined;
    }

    const cacheKey = endpoint;
    const cachedData = getCachedResponse(cacheKey);
    const controller = new AbortController();
    let active = true;

    if (cachedData !== null && cachedData !== undefined) {
      setData(cachedData);
      setLoading(false);
      setError("");
      setNotFound(false);
      setStatusCode(200);
    } else {
      setData(initialData);
      setLoading(true);
      setError("");
      setNotFound(false);
      setStatusCode(0);
    }

    const fetchData = async () => {
      try {
        const response = await api.get(endpoint, {
          signal: controller.signal,
        });

        if (!active) {
          return;
        }

        const nextData = transform(response.data);

        setData(nextData);
        setError("");
        setNotFound(false);
        setStatusCode(response.status || 200);
        setCachedResponse(cacheKey, nextData);
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

    fetchData();

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
    transform,
  ]);

  const refetch = useCallback(() => {
    if (endpoint) {
      responseCache.delete(endpoint);
    }
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
  } = options;

  return useApiRequest(endpoint, {
    enabled,
    initialData,
    suppressNotFoundError: true,
    transform: useCallback((payload) => {
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        return payload;
      }

      return initialData;
    }, [initialData]),
  });
};
