const Mailgun = require('mailgun-js');
const logger = require('../middleware/logger');

let mailgunInstance;

const getMailgunInstance = () => {
    if (!mailgunInstance) {
        const emailAPIKey = process.env.EMAIL_API_KEY;
        const emailDomain = process.env.EMAIL_DOMAIN || "mg.sargonsays.com"; // Use environment variable
        const emailFrom = process.env.EMAIL_FROM || "info@sargonsays.com"; // Use environment variable

        if (!emailAPIKey || !emailDomain) {
            logger.warn('Mailgun API key or domain missing. Email functionality will be limited.');
            return null; // Return null if not configured
        }

        mailgunInstance = new Mailgun({ apiKey: emailAPIKey, domain: emailDomain });
        mailgunInstance.emailFrom = emailFrom; // Attach 'from' address for convenience
    }
    return mailgunInstance;
};

module.exports = getMailgunInstance();