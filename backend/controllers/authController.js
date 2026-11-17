const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// @route POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({
    success: true,
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address, notes } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (notes !== undefined) user.notes = notes;
  await user.save();
  res.json({ success: true, user });
});

module.exports = { signup, login, getMe, updateMe };
