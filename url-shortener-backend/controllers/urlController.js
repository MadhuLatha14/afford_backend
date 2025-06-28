// controllers/urlController.js

const Url = require('../models/Url');
const generateShortcode = require('../utils/generateShortcode');
const geoip = require('geoip-lite');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// 1️⃣ Create Short URL
const createShortUrl = async (req, res) => {
    try {
        const { url, validity, shortcode } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Original URL is required.' });
        }

        let code = shortcode || generateShortcode();

        // Check uniqueness
        const exists = await Url.findOne({ shortCode: code });
        if (exists) {
            return res.status(400).json({ error: 'Shortcode already exists.' });
        }

        const minutes = validity || 30;
        const expiry = new Date(Date.now() + minutes * 60000); // milliseconds

        const newUrl = await Url.create({
            originalUrl: url,
            shortCode: code,
            expiresAt: expiry,
        });

        return res.status(201).json({
            shortUrl: `${BASE_URL}/${code}`,
            expiresAt: expiry.toISOString(),
        });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};

// 2️⃣ Redirect to Long URL
const redirectToLongUrl = async (req, res) => {
    try {
        const { shortcode } = req.params;
        const urlData = await Url.findOne({ shortCode: shortcode });

        if (!urlData) {
            return res.status(404).json({ error: 'Shortcode not found' });
        }

        if (new Date() > urlData.expiresAt) {
            return res.status(410).json({ error: 'Short URL has expired' });
        }

        const geo = geoip.lookup(req.ip);
        const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';

        urlData.clickCount += 1;
        urlData.clicks.push({
            timestamp: new Date(),
            referrer: req.get('Referrer') || 'Direct',
            location: location
        });

        await urlData.save();
        return res.redirect(urlData.originalUrl);
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};

// 3️⃣ Get Stats
const getUrlStats = async (req, res) => {
    try {
        const { shortcode } = req.params;
        const urlData = await Url.findOne({ shortCode: shortcode });

        if (!urlData) {
            return res.status(404).json({ error: 'Shortcode not found' });
        }

        return res.status(200).json({
            originalUrl: urlData.originalUrl,
            shortCode: urlData.shortCode,
            createdAt: urlData.createdAt.toISOString(),
            expiresAt: urlData.expiresAt.toISOString(),
            clickCount: urlData.clickCount,
            clicks: urlData.clicks,
        });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createShortUrl,
    redirectToLongUrl,
    getUrlStats
};
