import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: `OTGGlobalMobility/${folderName}`,
    });

    // Remove local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Remove local file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};

export { uploadOnCloudinary };
