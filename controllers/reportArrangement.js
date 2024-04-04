import User from '../models/userSchema.js';
import Report from '../models/reportSchema.js';


const reportArrangement = async (req, res,next) => {
  const userId = req.user._id;

  try {
    // Find all reports for the given user
    const allReports = await Report.find({ userId })
      .populate('category', 'name') // Populate category name
      .populate('companyBelongs'); // Populate company details

    // Create an object to store category-wise reports
    let categoryWiseReports = {};

    // Loop through all reports and group them by category
    for (const report of allReports) {
      const categoryName = report.category.name;

      // Check if the category already exists in the object
      if (!categoryWiseReports[categoryName]) {
        categoryWiseReports[categoryName] = [];
      }

      // Add the report to the category array
      categoryWiseReports[categoryName].push(report);
    }

    // Return the category-wise reports
    const userUpdate = await User.findOne({userId})
    userUpdate.arrangedReports = categoryWiseReports
    await userUpdate.save()

    next();

  } catch (error) {
    console.error('Error arranging reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default reportArrangement;