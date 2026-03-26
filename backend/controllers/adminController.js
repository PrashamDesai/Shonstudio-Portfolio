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

const createEntity = (Model, label) =>
  asyncHandler(async (req, res) => {
    try {
      ensurePayload(req.body, `A ${label}`);
      const payload = await normalizeSlugPayload(Model, req.body);
      const document = await Model.create(payload);
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
      const payload = await normalizeSlugPayload(Model, req.body, req.params.id);

      const document = await Model.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
      });

      if (!document) {
        throw createHttpError(404, `${label} not found`);
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
