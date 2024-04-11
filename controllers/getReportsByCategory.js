import Report from '../models/reportSchema.js'
import Category from '../models/categorySchema.js' 
const getReportsByCategory = async (req, res) => {
  const { userId, email } = req;

  try {
    const allReport = await Report.find({ userId: userId }).populate('Category');

    if (!allReport || allReport.length === 0) {
      return res.status(404).json({ success: false, message: 'No reports were found' });
    } else {
      let categoryWiseReport = {};

      // Iterate through each report and group by category and subcategory
      for (const report of allReport) {
        const { category } = report;

        if (!categoryWiseReport[category.categoryName]) {
          categoryWiseReport[category.categoryName] = {
            subcategories: category.subcategories,
            reports: [],
          };
        }

        categoryWiseReport[category.categoryName].reports.push(report);
      }

      return res.status(200).json({
        success: true,
        message: 'All Reports are sent',
        categoryWiseReport,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export default getReportsByCategory;