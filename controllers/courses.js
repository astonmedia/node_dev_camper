const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc        Get all Courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  // Initialize empty query var
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

// @desc        Get Single Course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }
  // Send the JSON response
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc        Add Course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  // Assign the bootcamp ID to the req object
  req.body.bootcamp = req.params.bootcampId;
  // Search db for the bootcamp
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  // Check to see if the boot camp exists before creating a course
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }
  // Create new course
  const course = await Course.create(req.body);
  // Send the JSON response
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc        Update Course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  // Search db for the bootcamp
  let course = await Course.findById(req.params.id);
  // Check to see if the boot camp exists before creating a course
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // Send the JSON response
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc        Delete Course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  // Search db for the bootcamp
  const course = await Course.findById(req.params.id);
  // Check to see if the boot camp exists before creating a course
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  await course.remove();
  // Send the JSON response
  res.status(200).json({
    success: true,
    data: {},
  });
});
