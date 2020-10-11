/* eslint-disable linebreak-style */
// **импорт
const loginRouter = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const login = require('../controllers/users');

// **функционал
// eslint-disable-next-line arrow-body-style

loginRouter.post('/', login);

// **экспорт
module.exports = loginRouter;
