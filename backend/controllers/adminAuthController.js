const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// @route POST /api/admin/auth/login
// Hardcoded credentials from env (ADMIN_EMAIL / ADMIN_PASSWORD) for now.
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  const token = jwt.sign({ role: 'admin', email }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1d',
  });

  res.json({ success: true, token, admin: { email } });
});

// @route GET /api/admin/auth/me
const adminMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = { adminLogin, adminMe };
