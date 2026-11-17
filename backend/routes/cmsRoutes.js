const express = require('express');
const router = express.Router();
const { getPublicPageContent, getSiteSettings } = require('../controllers/cmsController');

router.get('/site-settings', getSiteSettings);
router.get('/:pageKey', getPublicPageContent);

module.exports = router;
