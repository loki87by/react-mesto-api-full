/* eslint-disable object-curly-newline */
// **импорты
const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getMyInfo, getCurrentUser, updateUser, updateAvatar } = require('../controllers/users');

// **роуты
userRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
}), getUsers);
userRouter.get('/me', getMyInfo);
userRouter.get('/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum(),
  }),
}), getCurrentUser);
/*
userRouter.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
}), getMyInfo); */
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
    avatar: Joi.string().pattern(new RegExp('https?:\/{2}\\S+\\.(jpg|png|gif|svg)')).required(),
  }),
}), updateAvatar);

// **экспорт
module.exports = userRouter;
