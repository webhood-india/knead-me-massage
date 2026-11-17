const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// @route GET /api/services  (public - active only, unless ?all=true from admin)
const getServices = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: services.length, services });
});

// @route GET /api/services/:slug
const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (!service) {
    res.status(404);
    throw new Error('Treatment not found');
  }
  res.json({ success: true, service });
});

// @route POST /api/admin/services
const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, service });
});

// @route PUT /api/admin/services/:id
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    res.status(404);
    throw new Error('Treatment not found');
  }
  res.json({ success: true, service });
});

// @route DELETE /api/admin/services/:id
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Treatment not found');
  }
  res.json({ success: true, message: 'Treatment deleted' });
});

module.exports = { getServices, getServiceBySlug, createService, updateService, deleteService };
