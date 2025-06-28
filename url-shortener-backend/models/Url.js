// models/Url.js

const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    referrer: String,
    location: String,
});

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    clickCount: { type: Number, default: 0 },
    clicks: [clickSchema]
});

module.exports = mongoose.model('Url', urlSchema);
