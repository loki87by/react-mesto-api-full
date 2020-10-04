/* eslint-disable linebreak-style */
// **импорт
const createUserRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

// **функционал
// eslint-disable-next-line arrow-body-style
createUserRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(new RegExp('https?:\/{2}\\S+\\.(jpg|png|gif|svg)')).required(),
  }),
  referrer: Joi.string().unknown(true),
  referrerPolicy: Joi.string().unknown(true),
}), createUser);

// **экспорт
module.exports = createUserRouter;
