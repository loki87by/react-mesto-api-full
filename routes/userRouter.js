/* eslint-disable object-curly-newline */
// **импорты
const userRouter = require('express').Router();
const { celebrate, Joi, CelebrateErr } = require('celebrate');
const validator = require('validator');
const { getUsers, getMyInfo, getCurrentUser, updateUser, updateAvatar } = require('../controllers/users');

const validateUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateErr('Введите корректный URL');
  }
  return value;
};

// **роуты
userRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
}), getUsers);

userRouter.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
}), getMyInfo);

userRouter.get('/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), getCurrentUser);

userRouter.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().custom(validateUrl).required(),
  }),
}), updateAvatar);

// **экспорт
module.exports = userRouter;
