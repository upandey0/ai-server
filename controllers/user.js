import User from "../models/userSchema.js";
import jwt from 'jsonwebtoken'
import Company from '../models/companySchema.js'
import setCompanyForUser from "./setCompanyForUser.js";


//created the function to signup
export const userSignUp = async (req, res) => {
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

    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with user data
    res.status(201).json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        reports: savedUser.reports
        // Include other relevant user data
      }
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const userSignIn = async (req, res) => {
  const { auth0Id } = req.body;
  try {
    const user = await User.findOne({ auth0Id })
    if (!user) {
      return res.status(404).json({ success: false, message: 'No User Found' });
    } else {
      const id = user._id
      const token = jwt.sign({ id, auth0Id }, process.env.JWT_SECRET_KEY);
      let allCompanies = [];
      const allofficeIds = user.companies;
      // console.log(allofficeIds)
      for (const office of allofficeIds) {
        try {
          const company = await Company.findOne({ _id: office })
      //     console.log(company)
          allCompanies.push(company);
        } catch (e) {

        }
      }
      return res.cookie('token', token).status(200).json({ success: true, message: "User Logged In",setCompanyForUser, allCompanies });
    }
  } catch (e) {
    return res.json(e);
  }
}