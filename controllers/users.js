/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable quotes */
// **импорты
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundErr');
const BadRequestError = require('../errors/badRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

// **список пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => next(new BadRequestError(err)));
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
  const {
    name = 'Жак-Ив Кусто', about = 'Исследователь океана', avatar = 'https://kaskad.tv/images/2020/foto_zhak_iv_kusto__-_interesnie_fakti_20190810_1078596433.jpg', email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
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
  const { id } = req.params;
  return User.findOneAndUpdate({ id }, { name, about },
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

// *обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { id } = req.params;
  return User.findOneAndUpdate({ id }, { avatar },
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

// **логин
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })(+password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};
