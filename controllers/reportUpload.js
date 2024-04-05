import Report from '../models/reportSchema.js';
import Category from '../models/categorySchema.js';

const reportUpload = async (req, res) => {
  const { title, category, name, country, city, location } = req.body;
  const { userId } = req.body;

  try {
    let categoryId = await Category.findOne({ name: category });

    if (!categoryId) {
      const ctg = await Category.create({ name: category, userId });
      categoryId = ctg._id;
    }

    const report = await Report.create({ userId, category: categoryId, title });
    return res.status(200).json({ report });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

export default reportUpload;