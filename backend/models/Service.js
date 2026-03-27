import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
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
    summary: {
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
    category: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      default: "spark"
    },
    highlights: {
      type: [String],
      default: []
    },
    deliveryFormat: {
      type: String,
      default: ""
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

serviceSchema.pre("validate", function serviceSlug(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  next();
});

serviceSchema.index({ featured: -1, title: 1 });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
