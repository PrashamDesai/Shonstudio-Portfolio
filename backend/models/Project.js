import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false },
);

const caseStudyRowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: ""
    },
    summary: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false },
);

const caseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: ""
    },
    challenge: {
      type: String,
      trim: true,
      default: ""
    },
    goals: {
      type: [String],
      default: []
    },
    solutions: {
      type: [caseStudyRowSchema],
      default: []
    },
    pillars: {
      type: [caseStudyRowSchema],
      default: []
    },
    conclusion: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    tagline: {
      type: String,
      default: "",
      trim: true
    },
    shortDescription: {
      type: String,
      default: "",
      trim: true
    },
    cardImage: {
      type: String,
      default: ""
    },
    carouselImage: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    making: {
      type: String,
      default: "",
      trim: true
    },
    coverImage: {
      type: String,
      default: ""
    },
    heroImage: {
      type: String,
      default: ""
    },
    gallery: {
      type: [String],
      default: []
    },
    screenshotOrientation: {
      type: String,
      enum: ["portrait", "landscape"],
      default: "portrait"
    },
    technologies: {
      type: [String],
      default: []
    },
    features: {
      type: [String],
      default: []
    },
    caseStudy: {
      type: caseStudySchema,
      default: () => ({})
    },
    roleBreakdown: {
      type: [roleSchema],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  },
);

projectSchema.pre("validate", function projectSlug(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  next();
});

projectSchema.index({ createdAt: -1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
