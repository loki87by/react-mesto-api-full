/* eslint-disable object-curly-newline */
// **импорты
const cardRouter = require('express').Router();
const { createCard, getAllCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

// **роуты
cardRouter.post('/', createCard);
cardRouter.get('/', getAllCards);
cardRouter.delete('/:id', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

// **экспорт
module.exports = cardRouter;
