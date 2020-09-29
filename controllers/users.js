/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable quotes */
// **импорт модели
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFoundErr');

// **список пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => res.status(err.message ? 400 : 500).send({ message: err.message || 'На сервере произошла ошибка' }));
};

// **получение пользователя по айдишнику
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(err.message ? 404 : 500).send({ message: 'Нет такого пользователя' || 'На сервере произошла ошибка' });
      }
    });
};

// **новый пользователь
module.exports.createUser = (req, res) => {
  /*  const {
    email, password, name, about, avatar = req.user._id,
  } = req.body; */
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// **изменение юзердаты
// *обновление текстовой инфы
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => next(err));
  /* res.status(err.message ? 400 : 500)
  .send({ message: err.message || 'На сервере произошла ошибка' })); */
};

// *обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.params._id, { avatar },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => next(err));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
