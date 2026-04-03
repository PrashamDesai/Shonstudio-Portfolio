import Tool from "../models/Tool.js";
import asyncHandler from "../utils/asyncHandler.js";

const TOOL_CACHE_TTL_MS = 60 * 1000;
const TOOL_QUERY_TIMEOUT_MS = 20_000;

const toolListCache = new Map();
const toolDetailCache = new Map();

const setPublicCacheHeaders = (res) => {
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
};

const runWithTimeout = async (operationPromise, timeoutMs) => {
  let timer = null;

  try {
    return await Promise.race([
      operationPromise,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Tool query timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

const getFreshCachedValue = (cache, key) => {
  const cachedValue = cache.get(key);

  if (!cachedValue) {
    return null;
  }

  if (Date.now() - cachedValue.timestamp >= TOOL_CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return cachedValue.data;
};

const setCachedValue = (cache, key, data) => {
  cache.set(key, {
    timestamp: Date.now(),
    data,
  });
};

export const clearToolCache = (identifier = "") => {
  toolListCache.clear();

  if (!identifier) {
    toolDetailCache.clear();
    return;
  }

  toolDetailCache.delete(String(identifier).trim().toLowerCase());
};

export const getTools = asyncHandler(async (req, res) => {
  const type = String(req.query.type || "").trim();
  const filter = type ? { type } : {};
  const cacheKey = type.toLowerCase() || "all";
  const cachedTools = getFreshCachedValue(toolListCache, cacheKey);

  if (cachedTools) {
    setPublicCacheHeaders(res);
    res.json(cachedTools);
    return;
  }

  let tools = [];

  try {
    tools = await runWithTimeout(
      Tool.find(filter)
        .sort({ createdAt: -1 })
        .maxTimeMS(TOOL_QUERY_TIMEOUT_MS)
        .lean(),
      TOOL_QUERY_TIMEOUT_MS,
    );
  } catch {
    res.status(503);
    throw new Error("Tool data source is temporarily unavailable. Please try again.");
  }

  setCachedValue(toolListCache, cacheKey, tools);
  setPublicCacheHeaders(res);
  res.json(tools);
});

export const getToolBySlug = asyncHandler(async (req, res) => {
  const slug = String(req.params.slug || "").trim().toLowerCase();
  const cachedTool = getFreshCachedValue(toolDetailCache, slug);

  if (cachedTool) {
    setPublicCacheHeaders(res);
    res.json(cachedTool);
    return;
  }

  let tool = null;

  try {
    tool = await runWithTimeout(
      Tool.findOne({ slug })
        .maxTimeMS(TOOL_QUERY_TIMEOUT_MS)
        .lean(),
      TOOL_QUERY_TIMEOUT_MS,
    );
  } catch {
    res.status(503);
    throw new Error("Tool data source is temporarily unavailable. Please try again.");
  }

  if (!tool) {
    res.status(404);
    throw new Error("Tool not found");
  }

  setCachedValue(toolDetailCache, slug, tool);
  setPublicCacheHeaders(res);
  res.json(tool);
});

export const createTool = asyncHandler(async (req, res) => {
  const tool = await Tool.create(req.body);
  res.status(201).json(tool);
});
