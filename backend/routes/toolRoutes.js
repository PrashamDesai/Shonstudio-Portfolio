import express from "express";
import {
  getToolBySlug,
  getTools,
} from "../controllers/toolController.js";

const router = express.Router();

router.route("/").get(getTools);
router.route("/:slug").get(getToolBySlug);

export default router;
