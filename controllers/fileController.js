import Category from '../models/categorySchema.js'
import Company from '../models/companySchema.js';
import { cloudinary } from "../utils/cloudinary.js";
import User from "../models/userSchema.js";
import Report from "../models/reportSchema.js";


export const uploadFile = async (req, res) => {
  try {
    const { category, subcategory, companyName, country, city, location } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found for the given ID", success: false });
    }

   
    let categoryExists = await Category.findOne({ categoryName: category, userId });

    if (!categoryExists) {
      categoryExists = await Category.create({
        categoryName: category,
        subcategories: [subcategory],
        userId,
      });
    } else {
     
      const subcategoryExists = categoryExists.subcategories.includes(subcategory);

  
      if (!subcategoryExists) {
        categoryExists.subcategories.push(subcategory);
        await categoryExists.save();
      }
    }


    let companyExists = await Company.findOne({ name: companyName, 'country.name': country, 'country.cities.name': city, 'country.cities.locations.name': location, user: userId });

  
    if (!companyExists) {
      companyExists = await Company.create({
        name: companyName,
        user: userId,
        country: {
          name: country,
          cities: [
            {
              name: city,
              locations: [
                {
                  name: location,
                },
              ],
            },
          ],
        },
      });
    }



    const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path,
      {
        folder: "files",
        resource_type: "auto"
      });
  

    console.log('cloudinaryUpload:', cloudinaryUpload.secure_url);
    const newReport = new Report({
      userId,
      thumbnailURL: cloudinaryUpload.secure_url,
      category: categoryExists._id,
      companyBelongs: companyExists._id,
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
