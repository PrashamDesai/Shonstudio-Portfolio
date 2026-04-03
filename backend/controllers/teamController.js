import mongoose from "mongoose";

import Team from "../models/Team.js";
import asyncHandler from "../utils/asyncHandler.js";

const validCategories = new Set(["developer", "designer"]);
const TEAM_CACHE_TTL_MS = 60 * 1000;
const TEAM_QUERY_TIMEOUT_MS = 20_000;

const teamListCache = new Map();
const teamDetailCache = new Map();

const TEAM_SUMMARY_PROJECTION = {
  name: 1,
  role: 1,
  category: 1,
  coreTech: 1,
  bio: 1,
  profileImage: 1,
  updatedAt: 1,
};

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
          reject(new Error(`Team query timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getFreshCachedValue = (cache, key) => {
  const cachedValue = cache.get(key);

  if (!cachedValue) {
    return null;
  }

  if (Date.now() - cachedValue.timestamp >= TEAM_CACHE_TTL_MS) {
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

const buildTeamLookupFilter = (identifier) => {
  const normalizedIdentifier = String(identifier || "").trim();

  if (mongoose.Types.ObjectId.isValid(normalizedIdentifier)) {
    return { _id: normalizedIdentifier };
  }

  return {
    name: new RegExp(`^${escapeRegex(normalizedIdentifier)}$`, "i"),
  };
};

export const clearTeamCache = (identifier = "") => {
  teamListCache.clear();

  if (!identifier) {
    teamDetailCache.clear();
    return;
  }

  teamDetailCache.delete(String(identifier).trim().toLowerCase());
};

export const getTeamMembers = asyncHandler(async (req, res) => {
  const category = String(req.query.category || "").toLowerCase().trim();
  const view = String(req.query.view || "").toLowerCase().trim();
  const isSummaryView = view === "summary";
  const filter = validCategories.has(category) ? { category } : {};
  const cacheKey = `${category || "all"}:${isSummaryView ? "summary" : "full"}`;
  const cachedMembers = getFreshCachedValue(teamListCache, cacheKey);

  if (cachedMembers) {
    setPublicCacheHeaders(res);
    res.json(cachedMembers);
    return;
  }

  let members = [];

  try {
    members = await runWithTimeout(
      Team.find(filter, isSummaryView ? TEAM_SUMMARY_PROJECTION : undefined)
        .sort({ category: 1, name: 1 })
        .maxTimeMS(TEAM_QUERY_TIMEOUT_MS)
        .lean(),
      TEAM_QUERY_TIMEOUT_MS,
    );
  } catch {
    res.status(503);
    throw new Error("Team data source is temporarily unavailable. Please try again.");
  }

  setCachedValue(teamListCache, cacheKey, members);
  setPublicCacheHeaders(res);
  res.json(members);
});

export const getTeamMemberByIdentifier = asyncHandler(async (req, res) => {
  const identifier = String(req.params.identifier || "").trim();
  const cacheKey = identifier.toLowerCase();
  const cachedMember = getFreshCachedValue(teamDetailCache, cacheKey);

  if (cachedMember) {
    setPublicCacheHeaders(res);
    res.json(cachedMember);
    return;
  }

  let member = null;

  try {
    member = await runWithTimeout(
      Team.findOne(buildTeamLookupFilter(identifier))
        .maxTimeMS(TEAM_QUERY_TIMEOUT_MS)
        .lean(),
      TEAM_QUERY_TIMEOUT_MS,
    );
  } catch {
    res.status(503);
    throw new Error("Team member data source is temporarily unavailable. Please try again.");
  }

  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }

  setCachedValue(teamDetailCache, cacheKey, member);
  setCachedValue(teamDetailCache, String(member._id || "").trim().toLowerCase(), member);
  setPublicCacheHeaders(res);
  res.json(member);
});
