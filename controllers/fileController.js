import Category from '../models/categorySchema.js'
import Company from '../models/companySchema.js'
import { app } from '../firebase.js'

export const handleFileUpload = async (req, res) => {
  const { companyName, country, city, location, category, subcategories } = req.body
  const userId = req.userId

  if (!companyName || !country || !city || !location || !category || !subcategories || !Array.isArray(subcategories)) {
    return res.status(400).json({ message: 'Some fields are missing or subcategories is not an array', success: false })
  }

  const categoryExistance = await Category.findOne({ userId, categoryName: category })

  if (!categoryExistance) {
    const newCategory = await Category.create({
      userId,
      categoryName: category,
      subcategories
    })
  } else {
    // If the category already exists, update the subcategories array
    const updatedCategory = await Category.findOneAndUpdate(
      { userId, categoryName: category },
      { $addToSet: { subcategories: { $each: subcategories } } },
      { new: true }
    )
  }

  const companyExistance = await Company.findOne({
    name: companyName,
    user: userId,
    'country.name' : country,
    'country.cities.name' : city,
    'country.cities.location.name' : location
  })

  if(!companyExistance){
    return res.status(400).json({message: 'No such Company Exists', success: false})
  }

  const storage = getStorage(app);
  const fileRef = ref(storage, `${userId}/${companyName}/${country}/${city}/${location}/${category}/${subcategories.join('/')}`);
  const uploadTask = uploadBytesResumable(fileRef, file.data, {
    contentType: file.mimetype,
  });

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Handle progress updates
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    },
    (error) => {
      // Handle unsuccessful uploads
      console.error('Error uploading file:', error);
      return res.status(500).json({ message: 'Error uploading file', success: false });
    }, () => {
      // Handle successful upload
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        return res.status(200).json({ message: 'File uploaded successfully', success: true, downloadURL });
      });
    }
  );

}