const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Log the full authorization header for debugging
  console.log('Authorization Header:', req.headers.authorization);

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.error('No token provided');
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    // Add more detailed logging
    console.log('Attempting to verify token:', token);
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Secret is set' : 'Secret is UNDEFINED');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log the decoded token
    console.log('Decoded Token:', decoded);

    // Ensure the user object is correctly attached
    if (!decoded.user) {
      console.error('No user object in decoded token');
      return res.status(401).send({ message: 'Invalid token structure.' });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token Verification Error:', err);
    
    // More specific error handling
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).send({ message: 'Invalid token signature.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'Token has expired.' });
    }

    res.status(400).send({ message: 'Invalid token.', error: err.message });
  }
};

module.exports = auth;