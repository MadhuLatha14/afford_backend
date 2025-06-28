// utils/generateShortcode.js

const { customAlphabet } = require('nanoid');

const generateShortcode = () => {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nanoid = customAlphabet(alphabet, 6); // 6-character shortcode
    return nanoid();
};

module.exports = generateShortcode;
