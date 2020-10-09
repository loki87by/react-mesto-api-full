/* eslint-disable linebreak-style */
// **импорт
const createUserRouter = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

// **функционал
// eslint-disable-next-line arrow-body-style
createUserRouter.post('/', createUser);

// **экспорт
module.exports = createUserRouter;
