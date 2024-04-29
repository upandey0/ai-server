import Category from '../models/categorySchema.js'
import Company from '../models/companySchema.js';
import User from "../models/userSchema.js";
import Report from "../models/reportSchema.js";
import admin from 'firebase-admin'
import * as fs from 'fs';

export const uploadFile = async (req, res) => {
  const serviceAccount = {
    
      "type": "service_account",
      "project_id": "f-ai-a8fb5",
      "private_key_id": "ed00a3528d6b6aab8ff35814a9e97a5f037971c9",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEQb6FPnMbBxGX\nKzjRf60edT9+cY8EtIJJuKJnZ8UeEHQAhG2rH71pH/qNzZB4kJ15h2Nd+0bC37FW\n6ffvIo7pJYQXdYOt75DZHefptAjNRCt3s0x04YEOteKUWt/HUj2hleiI7tGq8+I4\ngYJDmU04TlBRHX80hEBDthJU4k8IEznluwsToGeFpAQufhMKIEF16YhiNfqssL9+\nfvM5T6l816uFyPJpbpZd74vM23l/7ypscTO8a5YrcuwUVGez+ePK6e8inlwpXkW/\nT6LdxmLiBIDtokF0NshHE9ZzxWe0e4zhVOL1vSRi7X1JSNn3h02OpMMt2zHvI7fF\n75sVuL4TAgMBAAECggEAEq0A8NQPBxDmoyCJUSJZuo7EwocS6Ys15McNqVJuJxzA\ntTXk68Zi82iIIstfhqGYYrK4CX76blv0F8W/AsIioFwiFEtqAvjLq2WVpp8rwUDN\n9B+bVHoLGnfDfoOhTOnuFHzb+n/jcuWvbtogJ8ekWgnVycpJSxmUtfzTBMHebHGh\nHQeaIoif+DNYND2jdtYE1K5KGXWhLqLpoOsTh1UB3hjA4bMIt66zusAydisPSocx\nTdwDDD8L21Q+W6/9d5ot3D+v7lgkUidIdNUVGGMPVnFpMrfE+ZyFJP2XrUXF7lgU\n5FzPr9HiBEPafYg1QqLUAxofGditoRax0ZkiLweChQKBgQD0PcU+qIlcj+TP135n\nN1Jamu8RWWioWrafxMBC/Ubf6EHw7AHOvHzQiUBhoF9ITha9ceubHpCGZgssYPCm\nQzgLEdHUMhGK6ybqHN4zyZVCBFbQAYCyamCfBzgYPQT+PfSMlqpUYBsBMClix60s\nYeolCJbYidvk60PNlXWgLoVEPQKBgQDNtJLijvn1rvIRUmMfqfDo0Uk0kP36m9xa\nTxePmsXudVeFQohMGYA8XFpj+c9GvdzyrAYaUd7qe8fGRXey7QvroP8j6FEa9E3J\nWlbrYCAlQg2Db2fzBHBZlXSkdhy+Gbx/lftw+6gtqN5NeQ/VcvcW/60TDelxhFf8\nZye/f8AgjwKBgDdLSL1vwHFRLlcTjU1my+ExVFBUMopyxweSrog7+PC2Dz+w3pPk\nPkmj2QyBFzEyZJmNEe7zU3rp3Tu10qWBcE2pQhzNHQWbSRsVYATPbVgdzV2YCX/a\n73bxVnS+U8QPWK7/aR5jB5oUQjpXxE/Y9v5dXHE3fK3tyVLgtFmITqltAoGARr3U\nzckxuQYDBWX55MfCq65dqJA8Z9T2ALC2f5JQg2MjSBbLXLBgY2G3TC560+8zbtkt\n+BszuBv9Zfg54/SVZuElHSolykk9/wLsZWHXbDi9APhtHSvnn0dAp9ZeqBmds5rW\nr9I70ggC+02o3lT9GJGw6Z6dK4bB43FuP/MlFY0CgYBFyyYO3AEHnX1UUTWxSDpc\ne4q8nsIrX/5O1DG5Y5ZN+292aJIGvIMUaZBogs9KnLuOSH3eX9UP2onqecEHO6Fm\niF5vSwyCTPwHyXJXRjSi/qBp4WHlRhpM6O2AjAekEezJm7Emv1PTFQpB9n9c8gct\ngbxGHsRUm2uKCQpAUcU6/A==\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-3c943@f-ai-a8fb5.iam.gserviceaccount.com",
      "client_id": "103010793039641475562",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3c943%40f-ai-a8fb5.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    
    
  };

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