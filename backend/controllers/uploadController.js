const asyncHandler = require('express-async-handler');

// @route POST /api/admin/upload  (admin auth, multipart/form-data field name "image")
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, url });
});

module.exports = { uploadImage };
