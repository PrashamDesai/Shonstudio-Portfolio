import express from "express";
import {
  getProjectBySlug,
  getProjectGalleryBySlug,
  getProjects,
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/").get(getProjects);
router.route("/:slug/gallery").get(getProjectGalleryBySlug);
router.route("/:slug").get(getProjectBySlug);

export default router;
