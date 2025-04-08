const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    // Determine resource type based on file extension
    const resourceType = filePath.toLowerCase().endsWith(".pdf")
      ? "raw"
      : "auto";

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: "uploads",
      type: "upload", // Publicly accessible
      access_mode: "public", // Explicitly set to public
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

module.exports = uploadToCloudinary;
