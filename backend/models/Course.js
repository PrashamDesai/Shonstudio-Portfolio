import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    curriculum: {
      type: [String],
      default: [],
    },
    outcomes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

courseSchema.pre("validate", function courseSlug(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
