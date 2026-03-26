import Service from "../models/Service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getServices = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const filter = category ? { category } : {};
  const services = await Service.find(filter).sort({ featured: -1, title: 1 });

  res.json(services);
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  res.json(service);
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});
