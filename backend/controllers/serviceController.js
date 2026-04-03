import Service from "../models/Service.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const QUERY_TIMEOUT_MS = 60000;
const SERVICE_LIST_CACHE_TTL_MS = 60 * 1000;
const SERVICE_MEDIA_QUERY_TIMEOUT_MS = 15000;

const runWithTimeout = async (operationPromise, timeoutMs) => {
  let timer = null;

  try {
    return await Promise.race([
      operationPromise,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Service query timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

const serviceListCache = {
  timestamp: 0,
  data: null,
};

const getCachedServiceList = () => {
  if (!serviceListCache.data) {
    return null;
  }

  if (Date.now() - serviceListCache.timestamp >= SERVICE_LIST_CACHE_TTL_MS) {
    serviceListCache.timestamp = 0;
    serviceListCache.data = null;
    return null;
  }

  return serviceListCache.data;
};

const setCachedServiceList = (services) => {
  serviceListCache.timestamp = Date.now();
  serviceListCache.data = services;
};

export const clearServiceListCache = () => {
  serviceListCache.timestamp = 0;
  serviceListCache.data = null;
};

export const getServices = asyncHandler(async (req, res) => {
  const category = req.query.category;

  if (!category) {
    const cachedServices = getCachedServiceList();

    if (cachedServices) {
      res.json(cachedServices);
      return;
    }
  }

  const filter = category ? { category } : {};
  let services = [];

  try {
    services = await runWithTimeout(
      Service.find(
        filter,
        {
          title: 1,
          slug: 1,
          summary: 1,
          shortDescription: 1,
          category: 1,
          icon: 1,
          highlights: 1,
          deliveryFormat: 1,
          featured: 1,
          updatedAt: 1,
        },
      )
        .sort({ featured: -1, title: 1 })
        .maxTimeMS(QUERY_TIMEOUT_MS)
        .lean(),
      QUERY_TIMEOUT_MS,
    );

    services = await Promise.all(
      services.map(async (service) => {
        try {
          const media = await runWithTimeout(
            Service.findById(service._id, {
              cardImage: 1,
              carouselImage: 1,
            })
              .maxTimeMS(SERVICE_MEDIA_QUERY_TIMEOUT_MS)
              .lean(),
            SERVICE_MEDIA_QUERY_TIMEOUT_MS,
          );

          return {
            ...service,
            cardImage: media?.cardImage || "",
            carouselImage: media?.carouselImage || "",
          };
        } catch {
          return {
            ...service,
            cardImage: "",
            carouselImage: "",
          };
        }
      }),
    );
  } catch (error) {
    const fallbackServices = !category ? getCachedServiceList() : null;

    if (fallbackServices?.length) {
      res.json(fallbackServices);
      return;
    }

    res.status(503);
    throw new Error("Service data source is temporarily unavailable. Please try again.");
  }

  if (!category) {
    setCachedServiceList(services);
  }

  res.json(services);
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const identifier = req.params.slug;
  let service = null;

  try {
    service = await runWithTimeout(
      Service.findOne({ slug: identifier })
        .maxTimeMS(QUERY_TIMEOUT_MS)
        .lean(),
      QUERY_TIMEOUT_MS,
    )
      || (mongoose.Types.ObjectId.isValid(identifier)
        ? await runWithTimeout(
          Service.findById(identifier)
            .maxTimeMS(QUERY_TIMEOUT_MS)
            .lean(),
          QUERY_TIMEOUT_MS,
        )
        : null);
  } catch (error) {
    try {
      service = await runWithTimeout(
        Service.findOne(
          { slug: identifier },
          {
            cardImage: 0,
            carouselImage: 0,
          },
        )
          .maxTimeMS(QUERY_TIMEOUT_MS)
          .lean(),
        QUERY_TIMEOUT_MS,
      );

      if (!service && mongoose.Types.ObjectId.isValid(identifier)) {
        service = await runWithTimeout(
          Service.findById(
            identifier,
            {
              cardImage: 0,
              carouselImage: 0,
            },
          )
            .maxTimeMS(QUERY_TIMEOUT_MS)
            .lean(),
          QUERY_TIMEOUT_MS,
        );
      }

      if (service) {
        service = {
          ...service,
          cardImage: "",
          carouselImage: "",
        };
      }
    } catch {
      res.status(503);
      throw new Error("Service data source is temporarily unavailable. Please try again.");
    }
  }

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
