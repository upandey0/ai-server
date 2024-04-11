import fs from "fs";
import { cloudinary } from "../utils/cloudinary.js";
import User from "../models/userSchema.js";
import Report from "../models/reportSchema.js";
// import mongoose from "mongoose";

export const uploadFile = async (req, res) => {
  console.log("inside cloudinary upload req file", req.file);
  try {
    const userId = req.userId;
    const title = "hello world";
    let thumbnail;

    console.log("userObjectId", userId);

    // Check if the user with the given ID exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found for the given ID", success: false });
    }
    const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path,
      {
        folder: "files",
        resource_type: "auto"
      });
    // Create a new report document and add it to the user's reports array
    console.log('cloudinaryUpload:', cloudinaryUpload.secure_url);
    const newReport = new Report({
      userId,
      thumbnailURL: cloudinaryUpload.secure_url,
      title: title
    });
    await newReport.save();
    console.log("newReport id is ", newReport._id);

    user.reports.push(newReport._id);
    await user.save();
    res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(200).json({ message: "file uploaded successfully on cloudinary", newReport });
    // user.reports.push(cloudinaryUpload.secure_url);
    // await user.save()
  } catch (error) {
    console.error("error in uploading file", error);
    res.status(400).json({ message: "failed to upload a file", errorP: error.message });
  }
};
