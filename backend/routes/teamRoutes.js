import express from "express";

import { getTeamMemberByIdentifier, getTeamMembers } from "../controllers/teamController.js";

const router = express.Router();

router.route("/").get(getTeamMembers);
router.route("/:identifier").get(getTeamMemberByIdentifier);

export default router;
