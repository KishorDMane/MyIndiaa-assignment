const jwt = require('jsonwebtoken');
const {userModel} = require("../module/user.module");

// Middleware to authenticate using JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
   
    next();
  } catch (ex) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};

// Middleware to authorize based on role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Access denied. You do not have the right permissions.' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
