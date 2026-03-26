import express from "express";

import { getCompany } from "../controllers/companyController.js";

const router = express.Router();

router.route("/").get(getCompany);

export default router;
