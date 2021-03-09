const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to Database
connectDB();

// Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser & Cookie Parser
app.use(express.json());
app.use(cookieParser());

// Dev logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

// Mount error handler
app.use(errorHandler);
const PORT = process.env.PORT || 8000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Err: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
