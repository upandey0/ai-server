import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs'
import { response } from 'express';
dotenv.config();     

cloudinary.config({ 
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}` , 
  api_key: `${process.env.CLOUDINARY_API_KEY}`, 
  api_secret: `${process.env.CLOUDINARY_API_SECRET}` 
});

const uploadOnCloudinary = async(localfilepath)=>{
  try {

    if(!localfilepath){
      return {success: false, message : "could not upload file. File is missing"}
    }

   const response =  await cloudinary.uploader.upload(localfilepath, {
      resource_type: 'auto'
    })
    console.log('File is uploaded on Cloudinary', response)
    return response
  } catch (error) {
    fs.unlinkSync(localfilepath)
    return null
  }
}

export {cloudinary};
