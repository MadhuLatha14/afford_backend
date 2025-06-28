// routes/urlRoutes.js

const express = require('express');
const router = express.Router();

const {
    createShortUrl,
    redirectToLongUrl,
    getUrlStats
} = require('../controllers/urlController');

// Create new short URL
router.post('/shorturls', createShortUrl);

// Get stats about a short URL
router.get('/shorturls/:shortcode', getUrlStats);

// Redirect to original URL
router.get('/:shortcode', redirectToLongUrl);

module.exports = router;
