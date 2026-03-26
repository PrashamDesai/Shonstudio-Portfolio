import express from "express";

import { getTeamMembers } from "../controllers/teamController.js";

const router = express.Router();

router.route("/").get(getTeamMembers);

export default router;
