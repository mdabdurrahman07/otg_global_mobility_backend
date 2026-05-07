import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Forbidden - Admin access required");
  }
  next();
});

export { verifyJWT, isAdmin };
