// **ошибка проблемного запроса
/* eslint-disable linebreak-style */
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
