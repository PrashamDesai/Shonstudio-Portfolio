import VisionScene from "../models/VisionScene.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getVisionScenes = asyncHandler(async (req, res) => {
  const scenes = await VisionScene.find({}).sort({ createdAt: 1 });
  res.json(scenes);
});

export const getVisionSceneById = asyncHandler(async (req, res) => {
  const scene = await VisionScene.findById(req.params.id);

  if (!scene) {
    res.status(404);
    throw new Error("Vision scene not found");
  }

  res.json(scene);
});
