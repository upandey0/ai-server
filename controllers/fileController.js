import fs from "fs";
import { cloudinary } from "../utils/cloudinary.js";
import User from "../models/userSchema.js";
import Report from "../models/reportSchema.js";
import mongoose from "mongoose";


export const uploadFile = async (req, res) => {
  console.log("inside cloudinary upload req file", req.file);
  try {
    const {userId} = "660d67012bb195dd6a7dc6db";
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if the user with the given ID exists
    const user = await User.findById(userObjectId);
   
    if (!user) {
      return res.status(404).json({ message: "User not found for the given ID" });
    }
    const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path,
     {
      folder: "files",
      resource_type:"auto"
    });
    // Create a new report document and add it to the user's reports array
    const newReport = new Report({
      userId: user._id,
      thumbnail: cloudinaryUpload.secure_url,
      // Add any other report-specific fields here
    });
    await newReport.save();

    user.reports.push(newReport);
    await user.save();
    console.log('cloudinaryUpload:', cloudinaryUpload.secure_url);
    res.status(200).json({ message: "file uploaded successfully on cloudinary", cloudinaryUrl:cloudinaryUpload.secure_url  });
    // user.reports.push(cloudinaryUpload.secure_url);
    // await user.save()
  } catch (error) {
    console.error("error in uploading file", error);
    res.status(400).json({ message: "failed to upload a file" });
  }
};
