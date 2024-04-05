import Report from '../models/reportSchema.js'
import Company from '../models/companySchema.js'
import Category from '../models/categorySchema.js'

const filterByCompany = async (req, res) => {
    const { companyName, country, city, location, userId } = req.body;
    try {
        const companyId = await Company.findOne({ $and: [{ name: companyName }, { country }, { user: userId }, { 'cities.name': city }, { 'cities.location.name': location }] }, { _id: 1 });

        if (!companyId) {
            return res.status(400).json({ success: false, message: 'Some fields are missing' });
        } else {
            const belongingReports = await Report.find({ companyBelongs: companyId });
            if (!belongingReports || belongingReports.length === 0) {
                return res.status(404).json({ success: true, message: "No reports were found" });
            }
            else {
                let categoryWiseReport = {};

                // Iterate through each report and fetch category information
                for (const report of belongingReports) {
                    const categoryToFind = report.category;

                    // Use await to wait for the Category.find() promise to resolve
                    const category = await Category.findById(categoryToFind);

                    if (!category) {
                        // Handle case where category is not found
                        console.log(`Category not found for report: ${report._id}`);
                    } else {
                        // Add report to categoryWiseReport
                        if (!categoryWiseReport[category.name]) {
                            categoryWiseReport[category.name] = [];
                        }
                        categoryWiseReport[category.name].push(report);
                    }
                }

                return res.status(200).json({ success: true, message: 'All Reports are sent', categoryWiseReport });
            }

        }
    } catch (e) {

        return res.status(500).json({ success: false, message: 'Internal Server Issue' })

    }
}

export default filterByCompany