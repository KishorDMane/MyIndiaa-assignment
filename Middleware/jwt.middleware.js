const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send({ error: 'Authorization header is missing' });
    }
  
    const token = authHeader.replace('Bearer ', '');
    jwt.verify(token, 'secretKey', (err, user) => {
      if (err) {
        return res.status(403).send({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };
module.exports = authMiddleware;