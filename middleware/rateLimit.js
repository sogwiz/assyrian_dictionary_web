// src/middleware/rateLimit.js
const rateLimit = require("express-rate-limit");

const emailRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: "Too many email requests from this IP, please try again after 15 minutes."
});

// Protects the LLM translation endpoint from a single IP running up spend by
// calling /api/translate directly. Each call costs ~1c and ~20s, so the cap is
// generous for real use (phrase searches + a few regenerations) but blocks
// scripted abuse. Configurable via env for tuning without a redeploy.
const translateRateLimiter = rateLimit({
    windowMs: parseInt(process.env.TRANSLATE_RATE_WINDOW_MS || (15 * 60 * 1000), 10),
    max: parseInt(process.env.TRANSLATE_RATE_MAX || 40, 10),
    message: { error: "Too many translation requests from this IP. Please wait a few minutes and try again." }
});

module.exports = { emailRateLimiter, translateRateLimiter };