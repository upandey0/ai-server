import  User from "../models/userModels.js";
// import bcryptjs from 'bcryptjs';

//created the function to signup
export const userSignUp=async (req,res)=>{
  try {
    const { auth0Id, name, email, authProvider, thirdPartyId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      auth0Id,
      name,
      email,
      authProvider,
      thirdPartyId,
      // Set other required fields
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with user data
    res.status(201).json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        reports:savedUser.reports
        // Include other relevant user data
      }
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}