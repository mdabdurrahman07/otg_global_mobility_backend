import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Testimonial from "../models/Testimonial.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const createTestimonial = asyncHandler(async (req, res) => {
  const { author, quote, location } = req.body;

  if (!author || !quote || !location) {
    throw new ApiError(400, "Author, quote, and location are required");
  }

  if (!req.file) {
    throw new ApiError(400, "Author image is required");
  }

  const uploadResponse = await uploadOnCloudinary(req.file.path, "testimonials");
  const authorImage = uploadResponse.secure_url;

  const testimonial = await Testimonial.create({
    author: author.trim(),
    quote: quote.trim(),
    location: location.trim(),
    authorImage,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});

const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        testimonials,
        `Retrieved ${testimonials.length} testimonials successfully`
      )
    );
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findByIdAndDelete(id);

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, testimonial, "Testimonial deleted successfully"));
});

export { createTestimonial, getAllTestimonials, deleteTestimonial };
