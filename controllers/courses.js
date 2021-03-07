const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

// @desc        Get all Courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  // Initiazlie empty query var
  let query;
  // Create query str based on req.params
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }
  // query the database
  const courses = await query;
  // Send the JSON response
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
