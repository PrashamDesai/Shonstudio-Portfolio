import Tool from "../models/Tool.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getTools = asyncHandler(async (req, res) => {
  const type = req.query.type;
  const filter = type ? { type } : {};
  const tools = await Tool.find(filter).sort({ createdAt: -1 });

  res.json(tools);
});

export const getToolBySlug = asyncHandler(async (req, res) => {
  const tool = await Tool.findOne({ slug: req.params.slug });

  if (!tool) {
    res.status(404);
    throw new Error("Tool not found");
  }

  res.json(tool);
});

export const createTool = asyncHandler(async (req, res) => {
  const tool = await Tool.create(req.body);
  res.status(201).json(tool);
});
