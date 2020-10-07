/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
// **импорты
const Card = require('../models/card');
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFoundErr');

// **создание карточки
module.exports.createCard = (req, res, next) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => {
      if (res.statusCode === 400) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      res.send({ card });
    })
    .catch((err) => next(err));
};

// **список карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((card) => res.send(card))
    .catch((err) => res.status(err.message ? 400 : 500).send({ message: err.message || 'На сервере произошла ошибка' }));
};

// **удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndRemove({ _id: req.params.id, owner })
    .then(({ card }) => {
      if (!card) {
        throw new NotFoundError('Такая карточка отсутствует в базе либо у вас нет прав на удаление');
      }
      res.send(card);
    })
    .catch((err) => next(err));
};

// **дополнительные действия с карточками
// *лайк
module.exports.likeCard = (req, res, next) => {
  const { _id } = req.params;
  return Card.findByIdAndUpdate({ _id },
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Неверный запрос');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => next(err));
};

// *дизлайк
module.exports.dislikeCard = (req, res, next) => {
  const { _id } = req.params;
  return Card.findByIdAndUpdate({ _id },
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Неверный запрос');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => next(err));
};
