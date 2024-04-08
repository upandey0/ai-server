import jwt from 'jsonwebtoken'

const authenticateUser = (req, res, next) => {
  // Check if token exists in cookies
  const token = req.cookies.token

  // If token doesn't exist, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Extract user id and auth0Id from the decoded token
    const { id, auth0Id } = decoded

    // Set the user id and auth0Id in the request object for further processing
    req.userId = id
    req.auth0Id = auth0Id

    // Call next middleware
    next()
  } catch (error) {
    // If token verification fails, return 401 Unauthorized
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export default authenticateUser