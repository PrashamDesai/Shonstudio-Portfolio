import mongoose from "mongoose";

const contactLinksSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: "",
      trim: true,
    },
    linkedIn: {
      type: String,
      default: "",
      trim: true,
    },
    github: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["developer", "designer"],
      lowercase: true,
      trim: true,
    },
    coreTech: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
      trim: true,
    },
    projects: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      default: "",
      trim: true,
    },
    contactLinks: {
      type: contactLinksSchema,
      default: () => ({}),
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
