import Report from '../models/reportSchema.js'
import Category from '../models/categorySchema.js'

const getReportsByCategory = async (req, res) => {
    const { userId } = req.body;

    try {
        const allReport = await Report.find({ userId: userId });

        if (!allReport || allReport.length === 0) {
            return res.status(404).json({ success: false, message: "No reports were found" });
        } else {
            let categoryWiseReport = {};

            // Iterate through each report and fetch category information
            for (const report of allReport) {
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
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default getReportsByCategory;
