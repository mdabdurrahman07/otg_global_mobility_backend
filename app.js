import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./src/utils/ApiError.js";

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import testimonialRoutes from "./src/routes/testimonialRoutes.js";
import inquiryRoutes from "./src/routes/inquiryRoutes.js";
import emailRoutes from "./src/routes/emailRoutes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/testimonials", testimonialRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/email", emailRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "OTG Global Mobility API is running" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: "Route not found",
    success: false,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  let error = err;

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    error = new ApiError(400, "Validation error", Object.values(err.errors).map(e => e.message));
  }

  // Handle Mongoose CastError
  if (err.name === "CastError") {
    error = new ApiError(400, "Invalid ID format");
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `${field} already exists`);
  }

  // If error is already an ApiError, use it as is
  if (!(error instanceof ApiError)) {
    error = new ApiError(error.statusCode || 500, error.message || "Internal server error");
  }

  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    success: error.success,
  });
});

export default app;
