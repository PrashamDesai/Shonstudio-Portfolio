import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { useAdmin } from "../context/AdminContext.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 5000,
});

const getMergeKey = (item) =>
  item?.slug || item?._id || item?.id || item?.name || item?.title || "";

const mergeRecords = (incoming, fallback) => {
  const fallbackMap = new Map(
    fallback.map((item) => [getMergeKey(item), item]).filter(([key]) => Boolean(key)),
  );

  return incoming.map((item) => ({
    ...fallbackMap.get(getMergeKey(item)),
    ...item,
  }));
};

export const useCollection = (endpoint, fallback) => {
  const { refreshVersion } = useAdmin();
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fallbackKey = JSON.stringify(fallback);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      setData(fallback);

      try {
        const response = await api.get(endpoint);

        if (!active) {
          return;
        }

        const nextData =
          Array.isArray(response.data) && response.data.length
            ? mergeRecords(response.data, fallback)
            : fallback;

        setData(nextData);
        setError("");
      } catch (requestError) {
        if (active) {
          setData(fallback);
          setError("Using local showcase content while the API is unavailable.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [endpoint, fallbackKey, refreshVersion]);

  return { data, loading, error };
};

export const useSingleton = (endpoint, fallback) => {
  const { refreshVersion } = useAdmin();
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fallbackKey = JSON.stringify(fallback);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      setData(fallback);

      try {
        const response = await api.get(endpoint);

        if (!active) {
          return;
        }

        setData({
          ...fallback,
          ...(response.data || {}),
        });
        setError("");
      } catch (requestError) {
        if (active) {
          setData(fallback);
          setError("Using local showcase content while the API is unavailable.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [endpoint, fallback, fallbackKey, refreshVersion]);

  return { data, loading, error };
};

export const useItem = (endpoint, fallback, slug) => {
  const { refreshVersion } = useAdmin();
  const fallbackItem = useMemo(
    () => fallback.find((item) => item.slug === slug) || null,
    [fallback, slug],
  );

  const [data, setData] = useState(fallbackItem);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchItem = async () => {
      setLoading(true);
      setError("");
      setData(fallbackItem);

      try {
        const response = await api.get(endpoint);

        if (!active) {
          return;
        }

        setData({
          ...fallbackItem,
          ...response.data,
        });
        setError("");
      } catch (requestError) {
        if (active) {
          setData(fallbackItem);
          setError("Showing local detail content while the API is unavailable.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      active = false;
    };
  }, [endpoint, fallbackItem, refreshVersion]);

  return { data, loading, error };
};
