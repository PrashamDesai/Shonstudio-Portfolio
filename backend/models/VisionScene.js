import mongoose from "mongoose";

const visionSceneSchema = new mongoose.Schema(
  {
    kicker: {
      type: String,
      required: true,
      trim: true,
    },
    pill: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    panelTitle: {
      type: String,
      default: "",
      trim: true,
    },
    panelSummary: {
      type: String,
      default: "",
      trim: true,
    },
    panelImage: {
      type: String,
      default: "",
      trim: true,
    },
    bullets: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const VisionScene = mongoose.model("VisionScene", visionSceneSchema);

export default VisionScene;
