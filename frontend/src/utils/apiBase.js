const LOCALHOST_BACKEND_ORIGIN = "http://localhost:5000";
const DEPLOYED_BACKEND_ORIGIN = "https://shonstudio-portfolio.onrender.com";

const normalizeApiBase = (rawUrl) => {
  const trimmed = String(rawUrl || "").trim();

  if (!trimmed) {
    return "/api";
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");

  if (withoutTrailingSlash.endsWith("/api")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api`;
};

const shouldUseLocalBackend = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const { hostname, origin } = window.location;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    origin.includes("localhost")
  );
};

const dedupeCandidates = (candidates) => Array.from(new Set(candidates.filter(Boolean)));

const stripTrailingSlashes = (value) => String(value || "").trim().replace(/\/+$/, "");

const isLocalOrigin = (origin) => {
  const normalizedOrigin = stripTrailingSlashes(origin).toLowerCase();

  return (
    normalizedOrigin.includes("localhost") ||
    normalizedOrigin.includes("127.0.0.1") ||
    normalizedOrigin.includes("[::1]") ||
    normalizedOrigin.endsWith("://::1")
  );
};

export const getApiBase = () => {
  return getApiBaseCandidates()[0];
};

export const getApiBaseCandidates = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  const deployedApiUrl = import.meta.env.VITE_DEPLOYED_API_URL;
  const localApi = normalizeApiBase(LOCALHOST_BACKEND_ORIGIN);

  if (shouldUseLocalBackend()) {
    return dedupeCandidates([localApi]);
  }

  const configuredDeployedOrigin = [deployedApiUrl, envApiUrl, DEPLOYED_BACKEND_ORIGIN]
    .map((value) => String(value || "").trim())
    .find((value) => value && !isLocalOrigin(value));

  if (configuredDeployedOrigin) {
    return dedupeCandidates([normalizeApiBase(configuredDeployedOrigin)]);
  }

  return dedupeCandidates([normalizeApiBase(DEPLOYED_BACKEND_ORIGIN)]);
};
