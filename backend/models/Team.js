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

const workHistorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    period: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const caseStudySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    client: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      default: "",
      trim: true,
    },
    period: {
      type: String,
      default: "",
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    outcomes: {
      type: [String],
      default: [],
    },
    stack: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const educationRecordSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      default: "",
      trim: true,
    },
    degree: {
      type: String,
      default: "",
      trim: true,
    },
    period: {
      type: String,
      default: "",
      trim: true,
    },
    details: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const testimonialSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      default: "",
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    quote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const resumeSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    totalExperience: {
      type: String,
      default: "",
      trim: true,
    },
    availability: {
      type: String,
      default: "",
      trim: true,
    },
    preferredEngagement: {
      type: String,
      default: "",
      trim: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    workHistory: {
      type: [workHistorySchema],
      default: [],
    },
    caseStudies: {
      type: [caseStudySchema],
      default: [],
    },
    educationRecords: {
      type: [educationRecordSchema],
      default: [],
    },
    testimonials: {
      type: [testimonialSchema],
      default: [],
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
    resume: {
      type: resumeSchema,
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

teamSchema.index({ category: 1, name: 1 });

const Team = mongoose.model("Team", teamSchema);

export default Team;
