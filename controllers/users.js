/* eslint-disable linebreak-style */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable quotes */
// **импорты
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundErr');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflictErr');

const { NODE_ENV, JWT_SECRET } = process.env;

// **список пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(err.message ? 400 : 500).send({ message: err.message || 'На сервере произошла ошибка' }));
};

// **получение своих данных

module.exports.getMyInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(err.message ? 404 : 500)
          .send({ message: 'Нет такого пользователя' || 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  if (req.params.id !== 'me') {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) throw new NotFoundError('Нет такого пользователя');
        res.send(user);
      })
      .catch(next);
  } else {
    this.getMyInfo();
  }
};
// **новый пользователь
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError({ message: 'Пользователь с таким email уже существует' });
      } else next(err);
    })
    .then((user) => {
      console.log(user);
      res.status(201).send(user);
    })
    .catch(next);
};
/*  .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
}; */

// **изменение юзердаты
// *обновление текстовой инфы
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  return User.findByIdAndUpdate({ _id }, { name, about },
    { new: true, runValidators: true })
    //
    .orFail(new Error('NotValidId'))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError({ message: 'Нет пользователя с таким id' });
      }
      throw new BadRequestError({ message: 'Запрос некорректен' });
    })
    //
    .then((user) => {
      /* if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else { */
      res.send(user);
    //  }
    })
    .catch((err) => next(err));
};

// *обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  return User.findByIdAndUpdate({ _id }, { avatar },
    { new: true, runValidators: true })
    //
    .orFail(new Error('NotValidId'))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError({ message: 'Нет пользователя с таким id' });
      }
      throw new BadRequestError({ message: 'Запрос некорректен' });
    })
    //
    .then((user) => {
    /* if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else { */
      res.send(user);
    //  }
    })
    .catch((err) => next(err));
};

// **логин
module.exports.login = (req, res) => {
  const { email } = req.body;
  // return User.findUserByCredentials(email, password)
  return User.findOne({ email })('+password')
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
      // next(err);
    });
};
/*
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch(next);
}; */
