import express from "express";

import { getCourseBySlug, getCourses } from "../controllers/courseController.js";

const router = express.Router();

router.route("/").get(getCourses);
router.route("/:slug").get(getCourseBySlug);

export default router;
