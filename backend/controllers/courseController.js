import Course from "../models/Course.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).sort({ title: 1 });
  res.json(courses);
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json(course);
});
