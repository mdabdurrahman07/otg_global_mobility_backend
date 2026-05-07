import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceImage: {
      type: String,
      required: [true, "Service image is required"],
    },
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      unique: true,
      trim: true,
    },
    details: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
