import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: "Dev Tools",
      trim: true
    },
    image: {
      type: String,
      default: ""
    },
    cardImage: {
      type: String,
      default: ""
    },
    carouselImage: {
      type: String,
      default: ""
    },
    shortDescription: {
      type: String,
      default: "",
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    useCase: {
      type: String,
      required: true,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    techUsed: {
      type: [String],
      default: []
    },
    price: {
      type: String,
      default: ""
    },
    ctaLabel: {
      type: String,
      default: "Use Tool",
      trim: true
    },
    ctaUrl: {
      type: String,
      default: "",
      trim: true
    },
    gallery: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  },
);

toolSchema.pre("validate", function toolSlug(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  next();
});

const Tool = mongoose.model("Tool", toolSchema);

export default Tool;
