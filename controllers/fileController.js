import fs from "fs";
import { cloudinary } from "../utils/cloudinary.js";
import User from "../models/userSchema.js";

export const uploadFile = async (req, res) => {
  console.log("inside cloudinary upload req file", req.file);
  try {
    const id = "660d67012bb195dd6a7dc6db";
    const user = await User.findById(id);
    const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path,
     {
      folder: "files",
      resource_type:"auto"
    });
    console.log('cloudinaryUpload:', cloudinaryUpload.secure_url);
    res.status(200).json({ message: "file uploaded successfully on cloudinary", cloudinaryUrl:cloudinaryUpload.secure_url  });
    // user.reports.push(cloudinaryUpload.secure_url);
    // await user.save()
  } catch (error) {
    console.error("error in uploading file", error);
    res.status(400).json({ message: "failed to upload a file" });
  }
};
