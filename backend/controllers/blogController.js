const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');

// @route GET /api/blog  (public - published only)
const getPublishedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).sort({ publishedAt: -1 });
  res.json({ success: true, count: blogs.length, blogs });
});

// @route GET /api/blog/:slug
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  res.json({ success: true, blog });
});

// ---------- ADMIN ----------

// @route GET /api/admin/blog  (all, incl. drafts)
const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, count: blogs.length, blogs });
});

// @route POST /api/admin/blog
const createBlog = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();
  const blog = await Blog.create(payload);
  res.status(201).json({ success: true, blog });
});

// @route PUT /api/admin/blog/:id
const updateBlog = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.status === 'published') payload.publishedAt = payload.publishedAt || new Date();
  const blog = await Blog.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  res.json({ success: true, blog });
});

// @route DELETE /api/admin/blog/:id
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  res.json({ success: true, message: 'Blog post deleted' });
});

module.exports = { getPublishedBlogs, getBlogBySlug, getAllBlogsAdmin, createBlog, updateBlog, deleteBlog };
