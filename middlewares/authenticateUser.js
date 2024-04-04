// import jwt from 'jsonwebtoken';
import User from '../models/userSchema';

const authenticateUser = async (req, res, next) => {
  try {
    // Get the access token or ID token from the cookies or headers
    let accessToken;
    if (req.cookies && req.cookies.access_token) {
      accessToken = req.cookies.access_token;
    } else if (req.headers.authorization) {
      accessToken = req.headers.authorization.split(' ')[1];
    } else {
      return res.status(401).json({ error: 'No access token provided' });
    }

    // Verify and decode the access token or ID token
    const decodedToken = jwt.verify(accessToken, process.env.AUTH0_PUBLIC_KEY);

    // Extract the Auth0 user ID (sub) from the decoded token
    const auth0UserId = decodedToken.sub;

    // Find the user in your database based on the Auth0 user ID
    const user = await User.findOne({ auth0Id: auth0UserId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user object to the request object for further use
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

export default authenticateUser;