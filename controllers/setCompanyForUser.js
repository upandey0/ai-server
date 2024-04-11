import User from '../models/userSchema.js';
import Company from '../models/companySchema.js';

const setCompanyForUser = async (req, res) => {
  const userId = req.userId;
  const { name, country, city, location } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!name || !country || !city || !location) {
      return res.status(400).json({ message: 'Some Fields are Missing' });
    }

    // Check if the company with the same name, country, city, and location already exists for the user
    let company = await Company.findOne({ name, user: userId, 'country.name': country });
    if (company) {
      // Check if the city already exists for the company
      const cityExists = company.country.cities.some((c) => c.name === city);
      if (cityExists) {
        // Check if the location already exists for the city
        const locationExists = company.country.cities.find((c) => c.name === city).locations.some((l) => l.name === location);
        if (!locationExists) {
          // Add the new location to the existing city
          await Company.updateOne(
            { _id: company._id, 'country.cities.name': city },
            { $push: { 'country.cities.$.locations': { name: location } } }
          );
        }
      } else {
        // Add the new city and location to the company
        await Company.updateOne(
          { _id: company._id },
          { $push: { 'country.cities': { name: city, locations: [{ name: location }] } } }
        );
      }
    } else {
      // Create a new company
      company = await Company.create({
        name,
        user: userId,
        country: { name: country, cities: [{ name: city, locations: [{ name: location }] }] },
      });
    }

    // Update the user's isCompanySet field if it's not already set
    if (!user.isCompanySet) {
      await User.findByIdAndUpdate(userId, { isCompanySet: true });
    }

    // Fetch the updated user object
    const updatedUser = await User.findById(userId);

    res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(201).json({ company });
  } catch (error) {
    console.error('Error setting company for user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default setCompanyForUser;