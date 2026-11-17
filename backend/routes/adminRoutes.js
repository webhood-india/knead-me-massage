const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuth');

const { adminLogin, adminMe } = require('../controllers/adminAuthController');
const { getDashboardStats, getAllCustomers, getAnalyticsLink, getCalendarEmbedUrl } = require('../controllers/adminController');
const { getAllBookings, updateBookingStatus, adminCreateBooking } = require('../controllers/bookingController');
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { getAllBlogsAdmin, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { uploadImage } = require('../controllers/uploadController');
const { upload } = require('../middleware/upload');
const { getAllGifts } = require('../controllers/giftController');
const { getPagesList, getPageForEdit, updatePageContent } = require('../controllers/cmsController');

// Auth
router.post('/auth/login', adminLogin);
router.get('/auth/me', protectAdmin, adminMe);

// Dashboard
router.get('/dashboard', protectAdmin, getDashboardStats);

// Bookings
router.get('/bookings', protectAdmin, getAllBookings);
router.post('/bookings', protectAdmin, adminCreateBooking);
router.put('/bookings/:id/status', protectAdmin, updateBookingStatus);

// Calendar (Google Calendar embed link)
router.get('/calendar-embed-url', protectAdmin, getCalendarEmbedUrl);

// Customers
router.get('/customers', protectAdmin, getAllCustomers);

// Services / Treatments
router.get('/services', protectAdmin, getServices); // ?all=true to include inactive
router.post('/services', protectAdmin, createService);
router.put('/services/:id', protectAdmin, updateService);
router.delete('/services/:id', protectAdmin, deleteService);

// Blog
router.get('/blog', protectAdmin, getAllBlogsAdmin);
router.post('/blog', protectAdmin, createBlog);
router.put('/blog/:id', protectAdmin, updateBlog);
router.delete('/blog/:id', protectAdmin, deleteBlog);

// Analytics (Microsoft Clarity link)
router.get('/analytics-link', protectAdmin, getAnalyticsLink);

// Image upload (treatments/blog)
router.post('/upload', protectAdmin, upload.single('image'), uploadImage);

// Gifted treatments
router.get('/gifts', protectAdmin, getAllGifts);

// CMS (site content editor)
router.get('/cms/pages', protectAdmin, getPagesList);
router.get('/cms/pages/:pageKey', protectAdmin, getPageForEdit);
router.put('/cms/pages/:pageKey', protectAdmin, updatePageContent);

module.exports = router;
