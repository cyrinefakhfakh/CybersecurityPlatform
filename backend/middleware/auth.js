const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  console.log('===== AUTH MIDDLEWARE DEBUG =====');
  console.log('Full Authorization Header:', authHeader);
  console.log('Extracted Token:', token);

  if (!token) {
    console.error('NO TOKEN PROVIDED');
    return res.status(401).json({ 
      message: 'No authentication token',
      debugInfo: { authHeader: req.headers.authorization }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Decoded Token:', {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });

    req.user = { 
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role 
    };

    next();
  } catch (error) {
    console.error('TOKEN VERIFICATION FAILED:', {
      name: error.name,
      message: error.message
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    res.status(401).json({ 
      message: 'Invalid or expired token',
      errorDetails: {
        name: error.name,
        message: error.message
      }
    });
  }
};
module.exports = auth;