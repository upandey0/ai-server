import User from '../models/userSchema.js';
import Company from '../models/companySchema.js';
import Report from '../models/reportSchema.js';
import Category from '../models/categorySchema.js';
import Office from '../models/officeSchema.js';

const getReportsFilteredByLocation = async (req, res) => {
  const { userId, companyName, country, city, locationName } = req.query;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'reports',
        populate: [
          {
            path: 'category',
            select: 'name',
          },
          {
            path: 'companyBelongs',
            populate: {
              path: 'offices',
              populate: {
                path: 'address',
              },
            },
          },
        ],
      })
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const filteredReports = user.reports.reduce((acc, report) => {
      const companyDetails = report.companyBelongs;
      const officeDetails = companyDetails.offices.find((office) => {
        const officeAddress = office.address;
        return (
          (!companyName || companyDetails.name === companyName) &&
          (!country || officeAddress.country === country) &&
          (!city || officeAddress.city === city) &&
          (!locationName || officeAddress.locationName === locationName)
        );
      });

      if (officeDetails) {
        const categoryName = report.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(report);
      }

      return acc;
    }, {});

    res.json(filteredReports);
  } catch (error) {
    console.error('Error filtering reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default getReportsFilteredByLocation;