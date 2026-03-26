import Team from "../models/Team.js";
import asyncHandler from "../utils/asyncHandler.js";

const validCategories = new Set(["developer", "designer"]);

export const getTeamMembers = asyncHandler(async (req, res) => {
  const category = String(req.query.category || "").toLowerCase().trim();
  const filter = validCategories.has(category) ? { category } : {};

  const members = await Team.find(filter).sort({ category: 1, name: 1 });
  res.json(members);
});
