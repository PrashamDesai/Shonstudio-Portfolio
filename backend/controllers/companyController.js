import Company from "../models/Company.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne().sort({ updatedAt: -1, createdAt: -1 });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  res.json(company);
});
