/* eslint-disable linebreak-style */
// **импорты
const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');

const dirPath = path.join(__dirname, '../logs');

// **функционал
// *логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(dirPath, 'request.log') }),
  ],
  format: winston.format.json(),
});
// *логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(dirPath, 'error.log') }),
  ],
  format: winston.format.json(),
});

// **экспорт
module.exports = {
  requestLogger,
  errorLogger,
};
