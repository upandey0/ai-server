import Report from '../models/reportSchema.js';
import Category from '../models/categorySchema.js';
import Company from '../models/companySchema.js';

const reportUpload = async (req, res) => {
  const { title, category, name, country, city, location } = req.body;
  const { userId } = req;

  try {
    // Find or create the category
    let categoryId = await Category.findOne({ name: category });
    if (!categoryId) {
      const ctg = await Category.create({ name: category, userId });
      categoryId = ctg._id;
    }

    // Find or create the company
    let companyId = await Company.findOne({
      name,
      user: userId,
      'country.name': country,
      'country.cities.name': city,
      'country.cities.locations.name': location,
    });
    if (!companyId) {
      const company = await Company.create({
        name,
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
      companyId = company._id;
    }

    // Create the report
    const report = await Report.create({
      userId,
      category: categoryId,
      title,
      companyBelongs: companyId,
    });

    return res.status(201).json({ report, success: true });
  } catch (e) {
    return res.status(500).json({ message: e.message, success: false });
  }
};

export default reportUpload;