import User from "../models/userSchema.js";
import jwt from 'jsonwebtoken'
import Company from '../models/companySchema.js'
import bcrypt from 'bcryptjs'
import emailValidator from 'email-validator'


export const userSignUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    // Check if the user already exists
    const emailValidation = emailValidator.validate(email);
    if (!emailValidation) {
      return res.status(400).json({ success: false, message: 'Kindly Provide Correct Email' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email Already Registered with this email',
      });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, process.env.JWT_SECRET_KEY);

    // Set the cookie with a 2-day expiration
    const expirationDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
    res.cookie('token', token, { expires: expirationDate });

    res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      user: { email: savedUser.email, isCompanySet: false },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const userSignIn = async (req, res) => {
  const { password, email } = req.body;

  const emailValidation = emailValidator.validate(email)
  if (!emailValidation) {
    return res.status(400).json({ success: false, message: 'Kindly Provide Correct Email' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'No User Found' });
    } else {
      const passwordValidation = await bcrypt.compare(password, user.password);
      if (!passwordValidation) {
        return res.status(404).json({ success: false, message: 'Invalid password' })
      }
      const id = user._id;
      const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY);
      let allCompanies = [];
      const allofficeIds = user.companies;

      const toSendUser = {
        email: user.email,
        isCompanySet: user.isCompanySet,

      }

      for (const office of allofficeIds) {
        try {
          const company = await Company.findOne({ _id: office })

          allCompanies.push(company);
        } catch (e) {
          return res.status(500).json({ success: false, message: e.message })
        }
      }
      res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.cookie('token', token).status(200).json({ success: true, message: "User Logged In", allCompanies, toSendUser });
    }
  } catch (e) {
    return res.json(e);
  }
}

export const userLogOut = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(404).json({ success: false, message: 'Unautorized user' });

  const { id, auth0Id } = jwt.decode(token, process.env.JWT_SECRET_KEY);
  res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.clearCookie('token');

  try {
    return res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error logging out', error: error.message });
  }

}

export const handleRefresh = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.json({ success: false, message: 'Invalid' });
  const { id, email } = jwt.decode(token, process.env.JWT_SECRET_KEY);
  if (!id || !email) {
    return res.status(401).json({ success: false, message: 'Unauthorized user' })
  }
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.json({ success: false, message: 'Invalid' });
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).json({ success: true, message: 'User Logged In', user });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}