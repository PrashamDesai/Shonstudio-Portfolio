import express from "express";

import { getVisionSceneById, getVisionScenes } from "../controllers/visionSceneController.js";

const router = express.Router();

router.route("/").get(getVisionScenes);
router.route("/:id").get(getVisionSceneById);

export default router;
