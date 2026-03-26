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
    technologies: {
      type: [String],
      default: []
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

const Project = mongoose.model("Project", projectSchema);

export default Project;
