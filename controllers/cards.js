/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
// **импорты
const Card = require('../models/card');
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFoundErr');
const ForbiddenError = require('../errors/forbiddenErr');

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
      res.send({ data: card });
    })
    .catch((err) => next(err));
};

// **список карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(err.message ? 400 : 500).send({ message: err.message || 'На сервере произошла ошибка' }));
};

// **удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError('Нет карточки с таким id');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }
      Card.findByIdAndDelete(req.params._id)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
    })
    .catch(next);
};

// **дополнительные действия с карточками
// *лайк
module.exports.likeCard = (req, res, next) => {
  const { id } = req.params;
  return Card.findByIdAndUpdate({ id },
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotValidId'))
    .then((likes) => res.send({
      data: likes,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Указаны некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

// *дизлайк
module.exports.dislikeCard = (req, res, next) => {
  const { id } = req.params;
  return Card.findByIdAndUpdate({ id },
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotValidId'))
    .then((likes) => res.send({
      data: likes,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Указаны некорректные данные при создании карточки');
      }
    })
    .catch(next);
};
