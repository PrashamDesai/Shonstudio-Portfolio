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
    image: {
      type: String,
      default: ""
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
