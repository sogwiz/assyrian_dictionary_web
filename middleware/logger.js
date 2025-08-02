// src/middleware/logger.js
const winston = require('winston');
require('winston-daily-rotate-file');
//const morgan = require('morgan');
const os = require('os');

const hostname = os.hostname();

const transport = new (winston.transports.DailyRotateFile)({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '60m',
    maxFiles: '180d'
});

const { combine, timestamp, label, printf, json } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        label({ label: `sargonsays_${hostname}` }),
        timestamp(),
        json() // Use JSON format for logs, better for parsing by log aggregators
    ),
    transports: [
        transport
    ]
});

// Stream for Morgan to pipe logs to Winston
logger.stream = {
    write: function(message, encoding) {
        // Morgan adds a newline, so trim it
        logger.info(message.trim());
    }
};

// Morgan middleware instance for HTTP request logging
//const morganInstance = morgan('combined', { stream: logger.stream });

module.exports = logger;
//module.exports.morganInstance = morganInstance;