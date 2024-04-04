import User from '../models/userSchema.js';
import Company from '../models/companySchema.js';

const setCompanyForUser = async (req, res) => {
  const userId = req.params.userId;
  const { name, country, city, location } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if(!name || !country || !city || !location)
      return res.status(400).json({message : 'Some Fields are Missing'})

    // Check if the company with the same name, country, city, and location already exists for the user
    const existingCompany = await Company.findOne({
      name,
      user: userId,
      country,
      cities: {
        $elemMatch: {
          name: city,
          locations: {
            $elemMatch: {
              name: location,
            },
          },
        },
      },
    });

    if (existingCompany) {
      return res.status(400).json({ error: 'Company with the same details already exists for this user' });
    }

    // Create a new company
    const newCompany = await Company.create({
      name,
      user: userId,
      country,
      cities: [
        {
          name: city,
          locations: location ? [{ name: location }] : [],
        },
      ],
    });

    // Add the new company to the user's companies array
    user.companies.push(newCompany._id);
    await user.save();

    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error setting company for user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default setCompanyForUser;