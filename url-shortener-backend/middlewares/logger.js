// middlewares/logger.js

const fs = require('fs');
const path = require('path');
const geoip = require('geoip-lite');
const useragent = require('useragent');

const logFilePath = path.join(__dirname, '..', 'logs.txt');

const logger = (req, res, next) => {
    const ip = req.ip;
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';

    const agent = useragent.parse(req.headers['user-agent']);
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${location} - ${agent.toString()}\n`;

    fs.appendFile(logFilePath, log, (err) => {
        if (err) {
            console.error('Failed to log request');
        }
    });

    next();
};

module.exports = logger;
