const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  createBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

// Import model
const Bootcamp = require("../models/Bootcamp");

// Advanced Results middleware
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

// Route for bootcamps by distance
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

// Route for file uploading
router.route("/:id/photo").put(bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
