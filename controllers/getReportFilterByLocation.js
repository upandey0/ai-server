import Report from '../models/reportSchema.js'
import Company from '../models/companySchema.js'
import Category from '../models/categorySchema.js'
const filterByCompany = async (req, res) => {
  const { companyName, country, city, location } = req.body;
  const userId = req.userId;

  try {
    const companyId = await Company.findOne({
      user: userId,
      name: companyName,
      'country.name': country,
      'country.cities.name': city,
      'country.cities.locations.name': location,
    });

    if (!companyId) {
      return res.status(400).json({ success: false, message: 'No Company Found' });
    } else {
      const belongingReports = await Report.find({ companyBelongs: companyId }).populate('category');

      if (!belongingReports || belongingReports.length === 0) {
        return res.status(200).json({ success: true, message: "No reports were found" });
      } else {
        let categoryWiseReport = {};

        // Iterate through each report and group by category and subcategory
        for (const report of belongingReports) {
          const { category } = report;

          if (!categoryWiseReport[category.categoryName]) {
            categoryWiseReport[category.categoryName] = {
              subcategories: category.subcategories,
              reports: [],
            };
          }

          categoryWiseReport[category.categoryName].reports.push(report);
        }

        res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return res.status(200).json({
          success: true,
          message: 'All Reports are sent',
          categoryWiseReport,
        });
      }
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Internal Server Issue', error: e.message });
  }
};

export default filterByCompany;