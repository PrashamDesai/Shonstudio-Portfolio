import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import Company from "./models/Company.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import Course from "./models/Course.js";
import Project from "./models/Project.js";
import Service from "./models/Service.js";
import Team from "./models/Team.js";
import Tool from "./models/Tool.js";
import VisionScene from "./models/VisionScene.js";
import companyRoutes from "./routes/companyRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import toolRoutes from "./routes/toolRoutes.js";
import visionSceneRoutes from "./routes/visionSceneRoutes.js";
import { initialData } from "./utils/seedData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_LOCAL_CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];
const DEFAULT_DEPLOYED_CLIENT_ORIGINS = ["https://shonstudio-portfolio-frontend.onrender.com"];
const DEFAULT_DEPLOYED_CLIENT_ORIGIN_PATTERNS = [
  "https://shonstudio-portfolio*.onrender.com",
  "https://shonstudio-portfolio*.vercel.app",
  "https://shonstudio-portfolio*.netlify.app",
];

const normalizeOrigin = (value) => {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");

  try {
    const parsedUrl = new URL(withoutTrailingSlash);
    const protocol = String(parsedUrl.protocol || "").toLowerCase();
    const hostname = String(parsedUrl.hostname || "").toLowerCase();
    const hasCustomPort =
      parsedUrl.port &&
      !(
        (protocol === "http:" && parsedUrl.port === "80") ||
        (protocol === "https:" && parsedUrl.port === "443")
      );
    const portSegment = hasCustomPort ? `:${parsedUrl.port}` : "";

    return `${protocol}//${hostname}${portSegment}`;
  } catch {
    return withoutTrailingSlash.toLowerCase();
  }
};

const normalizeOriginPattern = (value) =>
  String(value || "").trim().replace(/\/+$/, "").toLowerCase();

const splitAndNormalizeValues = (normalizer, ...values) =>
  values
    .flatMap((value) => String(value || "").split(","))
    .map((value) => normalizer(value))
    .filter(Boolean);

const wildcardPatternToRegExp = (pattern) => {
  const escapedPattern = String(pattern || "")
    .replace(/[|\\{}()[\]^$+?.]/g, "\\$&")
    .replace(/\*/g, ".*");

  return new RegExp(`^${escapedPattern}$`, "i");
};

const configuredClientOrigins = splitAndNormalizeValues(
  normalizeOrigin,
  process.env.CORS_ORIGINS,
  process.env.CORS_ORIGIN,
  process.env.CLIENT_URL,
  process.env.LOCAL_CLIENT_URL,
  process.env.FRONTEND_URL,
);
const configuredClientOriginPatterns = splitAndNormalizeValues(
  normalizeOriginPattern,
  process.env.CORS_ORIGIN_PATTERNS,
  process.env.CORS_ORIGIN_PATTERN,
);
const fallbackClientOrigins = process.env.NODE_ENV === "production"
  ? DEFAULT_DEPLOYED_CLIENT_ORIGINS
  : [...DEFAULT_LOCAL_CLIENT_ORIGINS, ...DEFAULT_DEPLOYED_CLIENT_ORIGINS];
const allowedClientOrigins = new Set([
  ...fallbackClientOrigins,
  ...configuredClientOrigins,
].map((origin) => normalizeOrigin(origin)));
const allowedClientOriginPatternMatchers = [
  ...DEFAULT_DEPLOYED_CLIENT_ORIGIN_PATTERNS,
  ...configuredClientOriginPatterns,
]
  .map((pattern) => normalizeOriginPattern(pattern))
  .filter(Boolean)
  .map((pattern) => wildcardPatternToRegExp(pattern));
const allowLoopbackOrigins = process.env.NODE_ENV !== "production";

const isLoopbackOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    const normalizedHost = String(hostname || "").trim().toLowerCase();

    return (
      normalizedHost === "localhost" ||
      normalizedHost === "127.0.0.1" ||
      normalizedHost === "::1" ||
      normalizedHost === "[::1]"
    );
  } catch {
    return false;
  }
};

const isAllowedClientOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return true;
  }

  if (allowedClientOrigins.has(normalizedOrigin)) {
    return true;
  }

  if (allowLoopbackOrigins && isLoopbackOrigin(normalizedOrigin)) {
    return true;
  }

  return allowedClientOriginPatternMatchers.some((matcher) => matcher.test(normalizedOrigin));
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedClientOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "shonstudio-api" });
});

app.use("/api/shonstudio-admin-secured", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/training", courseRoutes);
app.use("/api/vision-scenes", visionSceneRoutes);

app.use(notFound);
app.use(errorHandler);

const seedCollectionIfEmpty = async (Model, items) => {
  const existingCount = await Model.countDocuments();

  if (!existingCount) {
    const documents = Array.isArray(items) ? items : [items];
    await Model.insertMany(documents);
  }
};

const seedCollectionIfMissing = async (Model, items, uniqueKey) => {
  const documents = Array.isArray(items) ? items : [items];
  const operations = documents
    .map((document) => {
      const keyValue = String(document?.[uniqueKey] || "").trim();

      if (!keyValue) {
        return null;
      }

      return Model.updateOne(
        { [uniqueKey]: keyValue },
        { $setOnInsert: document },
        { upsert: true },
      );
    })
    .filter(Boolean);

  if (operations.length) {
    await Promise.all(operations);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await Promise.all([
      seedCollectionIfEmpty(Project, initialData.projects),
      seedCollectionIfEmpty(Service, initialData.services),
      seedCollectionIfEmpty(Tool, initialData.tools),
      seedCollectionIfEmpty(Course, initialData.courses),
      seedCollectionIfEmpty(Company, initialData.company),
      seedCollectionIfEmpty(Team, initialData.team),
      seedCollectionIfEmpty(VisionScene, initialData.visionScenes),
    ]);
    await seedCollectionIfMissing(Tool, initialData.tools, "slug");

    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
