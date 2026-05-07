import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Service from "../models/Service.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const createService = asyncHandler(async (req, res) => {
  const { serviceName, shortDescription, details } = req.body;

  if (!serviceName || !shortDescription) {
    throw new ApiError(400, "Service name and short description are required");
  }

  if (!req.file) {
    throw new ApiError(400, "Service image is required");
  }

  const uploadResponse = await uploadOnCloudinary(req.file.path, "ServiceImages");
  const serviceImage = uploadResponse.secure_url;

  const service = await Service.create({
    serviceName: serviceName.trim(),
    shortDescription: shortDescription.trim(),
    serviceImage,
    details: details ? (Array.isArray(details) ? details : [details]) : [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, service, "Service created successfully"));
});

const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, services, `Retrieved ${services.length} services successfully`)
    );
});

const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, service, "Service retrieved successfully"));
});

const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { serviceName, shortDescription, details } = req.body;

  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  let serviceImage = service.serviceImage;
  if (req.file) {
    const uploadResponse = await uploadOnCloudinary(req.file.path, "ServiceImages");
    serviceImage = uploadResponse.secure_url;
  }

  const updatedService = await Service.findByIdAndUpdate(
    id,
    {
      $set: {
        serviceName: serviceName ? serviceName.trim() : service.serviceName,
        shortDescription: shortDescription
          ? shortDescription.trim()
          : service.shortDescription,
        serviceImage,
        details: details ? (Array.isArray(details) ? details : [details]) : service.details,
      },
    },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedService, "Service updated successfully"));
});

const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByIdAndDelete(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, service, "Service deleted successfully"));
});

export {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
