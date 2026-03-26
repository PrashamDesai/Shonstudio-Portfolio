import Project from "../models/Project.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProjects = asyncHandler(async (req, res) => {
  const featuredOnly = req.query.featured === "true";

  const filter = featuredOnly ? { featured: true } : {};
  const projects = await Project.find(filter).sort({ createdAt: -1 });

  res.json(projects);
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json(project);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});
