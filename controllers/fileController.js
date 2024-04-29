import Category from '../models/categorySchema.js'
import Company from '../models/companySchema.js';
import User from "../models/userSchema.js";
import Report from "../models/reportSchema.js";
import admin from 'firebase-admin'
import * as fs from 'fs';

export const uploadFile = async (req, res) => {
  const serviceAccount = JSON.parse(fs.readFileSync('f-ai.json', 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET
  }, 'f-ai')

  const storage = admin.storage()
  const bucket = storage.bucket()
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

    let companyExists = await Company.findOne({
      name: companyName,
      'country.name': country,
      'country.cities.name': city,
      'country.cities.locations.name': location,
      user: userId
    });

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

    // Upload the file to Firebase Storage
    const firebaseUpload = await bucket.upload(req.file.path, {
      destination: `files/${req.file.originalname}`, // Specify the destination path in Firebase Storage
      metadata: {
        metadata: {
          contentType: req.file.mimetype,
        },
      },
    });

    // Get the public download URL of the uploaded file
    const [publicUrl] = await firebaseUpload[0].getSignedUrl({
      action: 'read',
    });

    console.log('Firebase Upload URL:', publicUrl);

    const newReport = new Report({
      userId,
      thumbnailURL: publicUrl, // Use the Firebase public URL for the uploaded file
      category: categoryExists._id,
      companyBelongs: companyExists._id,
    });

    await newReport.save();
    console.log('newReport id is ', newReport._id);
    user.reports.push(newReport._id);
    await user.save();

    res.header("Access-Control-Allow-Credentials", "true");
    res.status(200).json({ message: 'File uploaded successfully to Firebase', newReport });
  } catch (error) {
    console.error('Error in uploading file', error);
    res.status(400).json({ message: 'Failed to upload a file', errorP: error.message });
  }
};