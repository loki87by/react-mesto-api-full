/* eslint-disable object-curly-newline */
// **импорты
const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCard, getAllCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

// **роуты
cardRouter.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().pattern(new RegExp('https?:\/{2}\\S+\\.(jpg|png|gif|svg)')).required(),
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
}), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
}), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(new RegExp('^Bearer +')),
  }).unknown(true),
}), dislikeCard);

// **экспорт
module.exports = cardRouter;
