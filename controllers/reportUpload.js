import Report from '../models/reportSchema.js';
import Category from '../models/categorySchema.js';

const reportUpload = async (req, res) => {
  const { title, category, name, country, city, location } = req.body;
  const { userId } = req.userId;

  try {
    let categoryId = await Category.findOne({ name: category });

    if (!categoryId) {
      const ctg = await Category.create({ name: category, userId });
      categoryId = ctg._id;
    }

    let companyId = await Company.findOne({
      name,
      country,
      'cities.name': city,
      'cities.locations.name': location,
      user: userId,
    });

    if (!companyId) {
      const company = await Company.create({
        name,
        country,
        cities: [{ name: city, locations: [{ name: location }] }],
        user: userId,
      });
      companyId = company._id;
    }

    const report = await Report.create({ userId, category: categoryId, title, companyBelongs : companyId });
    return res.status(201).json({ report, success: true });
  } catch (e) {
    return res.json({ message: e.message});
  }
};

export default reportUpload;