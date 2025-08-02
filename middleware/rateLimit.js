// src/middleware/rateLimit.js
const rateLimit = require("express-rate-limit");

const emailRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: "Too many email requests from this IP, please try again after 15 minutes."
});

module.exports = { emailRateLimiter };