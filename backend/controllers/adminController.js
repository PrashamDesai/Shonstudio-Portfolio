import crypto from "crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Company from "../models/Company.js";
import Course from "../models/Course.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";
import Team from "../models/Team.js";
import Tool from "../models/Tool.js";
import VisionScene from "../models/VisionScene.js";
import { clearProjectListCache, clearProjectResponseCache } from "./projectController.js";
import { clearServiceListCache } from "./serviceController.js";
import { clearTeamCache } from "./teamController.js";
import { clearToolCache } from "./toolController.js";
import { resolveUniqueSlug } from "../utils/slug.js";
import asyncHandler from "../utils/asyncHandler.js";

const createDigest = (value) =>
  crypto.createHash("sha256").update(String(value || "")).digest();

const isNonEmptyObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0;

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid resource id");
  }
};

const ensurePayload = (payload, action) => {
  if (!isNonEmptyObject(payload)) {
    throw createHttpError(400, `${action} payload is required`);
  }
};

const handleControllerError = (res, error, fallbackMessage) => {
  if (error?.statusCode) {
    res.status(error.statusCode);
    throw error;
  }

  if (error?.name === "ValidationError") {
    res.status(400);
    throw new Error(error.message);
  }

  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    res.status(409);
    throw new Error(`Duplicate value for ${duplicateField}`);
  }

  res.status(500);
  throw new Error(fallbackMessage);
};

const modelSupportsSlug = (Model) =>
  Boolean(Model?.schema?.path("slug")) && Boolean(Model?.schema?.path("title"));

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const normalizeProjectMediaPayload = (Model, payload) => {
  if (Model?.modelName !== "Project" || !isNonEmptyObject(payload)) {
    return payload;
  }

  const nextPayload = { ...payload };
  const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");
  const normalizeStringArray = (value) =>
    Array.isArray(value)
      ? value.map((item) => normalizeText(item)).filter(Boolean)
      : [];
  const normalizeCaseStudyRows = (value) =>
    Array.isArray(value)
      ? value
          .map((item) => ({
            title: normalizeText(item?.title),
            summary: normalizeText(item?.summary),
          }))
          .filter((item) => item.title || item.summary)
      : [];

  const nextDescription = normalizeText(nextPayload.description);
  const nextShortDescription = normalizeText(nextPayload.shortDescription);
  const nextTagline = normalizeText(nextPayload.tagline);

  if (!nextShortDescription && nextTagline) {
    nextPayload.shortDescription = nextTagline;
  }

  if (!nextTagline && nextShortDescription) {
    nextPayload.tagline = nextShortDescription;
  }

  if (!nextPayload.shortDescription && nextDescription) {
    nextPayload.shortDescription = nextDescription;
  }

  if (!nextPayload.tagline && nextPayload.shortDescription) {
    nextPayload.tagline = nextPayload.shortDescription;
  }

  if (hasOwn(nextPayload, "cardImage") && !hasOwn(nextPayload, "coverImage")) {
    nextPayload.coverImage = nextPayload.cardImage;
  }

  if (hasOwn(nextPayload, "coverImage") && !hasOwn(nextPayload, "cardImage")) {
    nextPayload.cardImage = nextPayload.coverImage;
  }

  if (hasOwn(nextPayload, "carouselImage") && !hasOwn(nextPayload, "heroImage")) {
    nextPayload.heroImage = nextPayload.carouselImage;
  }

  if (hasOwn(nextPayload, "heroImage") && !hasOwn(nextPayload, "carouselImage")) {
    nextPayload.carouselImage = nextPayload.heroImage;
  }

  if (isNonEmptyObject(nextPayload.caseStudy)) {
    nextPayload.caseStudy = {
      title: normalizeText(nextPayload.caseStudy.title),
      challenge: normalizeText(nextPayload.caseStudy.challenge),
      goals: normalizeStringArray(nextPayload.caseStudy.goals),
      solutions: normalizeCaseStudyRows(nextPayload.caseStudy.solutions),
      pillars: normalizeCaseStudyRows(nextPayload.caseStudy.pillars),
      conclusion: normalizeText(nextPayload.caseStudy.conclusion),
    };
  }

  return nextPayload;
};

const normalizeSlugPayload = async (Model, payload, resourceId = null) => {
  const nextPayload = { ...payload };

  if (typeof nextPayload.title === "string") {
    nextPayload.title = nextPayload.title.trim();
  }

  if (!modelSupportsSlug(Model)) {
    return nextPayload;
  }

  if (typeof nextPayload.slug === "string") {
    nextPayload.slug = nextPayload.slug.trim();
  }

  const slugSource = nextPayload.slug || nextPayload.title;

  if (!slugSource) {
    delete nextPayload.slug;
    return nextPayload;
  }

  nextPayload.slug = await resolveUniqueSlug(Model, slugSource, resourceId);
  return nextPayload;
};

const normalizeEntityPayload = async (Model, payload, resourceId = null) => {
  const mediaNormalizedPayload = normalizeProjectMediaPayload(Model, payload);
  return normalizeSlugPayload(Model, mediaNormalizedPayload, resourceId);
};

const createEntity = (Model, label) =>
  asyncHandler(async (req, res) => {
    try {
      ensurePayload(req.body, `A ${label}`);
      const payload = await normalizeEntityPayload(Model, req.body);
      const document = await Model.create(payload);

      if (Model?.modelName === "Project") {
        clearProjectListCache();
        clearProjectResponseCache(document?._id);
        clearProjectResponseCache(document?.slug);
      }

      if (Model?.modelName === "Service") {
        clearServiceListCache();
      }

      if (Model?.modelName === "Tool") {
        clearToolCache(document?.slug);
      }

      if (Model?.modelName === "Team") {
        clearTeamCache(document?._id);
      }

      res.status(201).json({
        message: `${label} created successfully`,
        data: document,
      });
    } catch (error) {
      handleControllerError(res, error, `Unable to create ${label}`);
    }
  });

const updateEntity = (Model, label) =>
  asyncHandler(async (req, res) => {
    try {
      ensureObjectId(req.params.id);
      ensurePayload(req.body, `A ${label}`);
      const payload = await normalizeEntityPayload(Model, req.body, req.params.id);

      const document = await Model.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
      });

      if (!document) {
        throw createHttpError(404, `${label} not found`);
      }

      if (Model?.modelName === "Project") {
        clearProjectListCache();
        clearProjectResponseCache(req.params.id);
        clearProjectResponseCache(document?._id);
        clearProjectResponseCache(document?.slug);
      }

      if (Model?.modelName === "Service") {
        clearServiceListCache();
      }

      if (Model?.modelName === "Tool") {
        clearToolCache(req.params.id);
        clearToolCache(document?.slug);
      }

      if (Model?.modelName === "Team") {
        clearTeamCache(req.params.id);
        clearTeamCache(document?._id);
      }

      res.json({
        message: `${label} updated successfully`,
        data: document,
      });
    } catch (error) {
      handleControllerError(res, error, `Unable to update ${label}`);
    }
  });

const deleteEntity = (Model, label) =>
  asyncHandler(async (req, res) => {
    try {
      ensureObjectId(req.params.id);

      const document = await Model.findByIdAndDelete(req.params.id);

      if (!document) {
        throw createHttpError(404, `${label} not found`);
      }

      if (Model?.modelName === "Project") {
        clearProjectListCache();
        clearProjectResponseCache(req.params.id);
        clearProjectResponseCache(document?._id);
        clearProjectResponseCache(document?.slug);
      }

      if (Model?.modelName === "Service") {
        clearServiceListCache();
      }

      if (Model?.modelName === "Tool") {
        clearToolCache(req.params.id);
        clearToolCache(document?.slug);
      }

      if (Model?.modelName === "Team") {
        clearTeamCache(req.params.id);
        clearTeamCache(document?._id);
      }

      res.json({
        message: `${label} deleted successfully`,
        data: {
          id: document._id,
        },
      });
    } catch (error) {
      handleControllerError(res, error, `Unable to delete ${label}`);
    }
  });

const upsertSingletonEntity = (Model, label) =>
  asyncHandler(async (req, res) => {
    try {
      ensurePayload(req.body, `A ${label}`);

      const document = await Model.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        sort: { createdAt: 1 },
      });

      res.json({
        message: `${label} updated successfully`,
        data: document,
      });
    } catch (error) {
      handleControllerError(res, error, `Unable to update ${label}`);
    }
  });

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    res.status(500);
    throw new Error("Admin authentication is not configured");
  }

  const isEmailValid = crypto.timingSafeEqual(
    createDigest(email.toLowerCase()),
    createDigest(ADMIN_EMAIL.toLowerCase()),
  );
  const isPasswordValid = crypto.timingSafeEqual(
    createDigest(password),
    createDigest(ADMIN_PASSWORD),
  );

  if (!isEmailValid || !isPasswordValid) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  const token = jwt.sign(
    {
      email: ADMIN_EMAIL,
      role: "admin",
    },
    JWT_SECRET,
    {
      expiresIn: "12h",
    },
  );

  res.json({
    message: "Admin login successful",
    token,
    admin: {
      email: ADMIN_EMAIL,
      role: "admin",
    },
  });
});

export const createProjectAdmin = createEntity(Project, "Project");
export const updateProjectAdmin = updateEntity(Project, "Project");
export const deleteProjectAdmin = deleteEntity(Project, "Project");

export const createServiceAdmin = createEntity(Service, "Service");
export const updateServiceAdmin = updateEntity(Service, "Service");
export const deleteServiceAdmin = deleteEntity(Service, "Service");

export const createToolAdmin = createEntity(Tool, "Tool");
export const updateToolAdmin = updateEntity(Tool, "Tool");
export const deleteToolAdmin = deleteEntity(Tool, "Tool");

export const createCourseAdmin = createEntity(Course, "Course");
export const updateCourseAdmin = updateEntity(Course, "Course");
export const deleteCourseAdmin = deleteEntity(Course, "Course");

export const createTeamAdmin = createEntity(Team, "Team member");
export const updateTeamAdmin = updateEntity(Team, "Team member");
export const deleteTeamAdmin = deleteEntity(Team, "Team member");

export const updateCompanyAdmin = upsertSingletonEntity(Company, "Company profile");

export const createVisionSceneAdmin = createEntity(VisionScene, "Vision scene");
export const updateVisionSceneAdmin = updateEntity(VisionScene, "Vision scene");
export const deleteVisionSceneAdmin = deleteEntity(VisionScene, "Vision scene");
