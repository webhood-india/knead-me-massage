const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Admin is hardcoded via env for now (no DB record needed).
// Token payload just carries { role: 'admin', email }.
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, admin token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (decoded.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized as admin');
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, admin token invalid or expired');
  }
});

module.exports = { protectAdmin };
