import express from "express";
import {
  getServiceBySlug,
  getServices,
} from "../controllers/serviceController.js";

const router = express.Router();

router.route("/").get(getServices);
router.route("/:slug").get(getServiceBySlug);

export default router;
