/* eslint-disable object-curly-newline */
// **импорты
const cardRouter = require('express').Router();
const { celebrate, Joi, CelebrateErr } = require('celebrate');
const validator = require('validator');
const { createCard, getAllCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

const validateUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateErr('Введите корректный URL');
  }
  return value;
};

// **роуты
cardRouter.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().custom(validateUrl).required(),
  }),
}), createCard);

cardRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
}), getAllCards);

cardRouter.delete('/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }).unknown(true),
}), deleteCard);

cardRouter.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }).unknown(true),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }).unknown(true),
}), dislikeCard);

// **экспорт
module.exports = cardRouter;
