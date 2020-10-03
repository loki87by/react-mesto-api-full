/* eslint-disable import/newline-after-import */
/* eslint-disable prefer-arrow-callback */
// **импорты
const express = require('express');
const userLimit = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const authRouter = require('./routes/auth');
const cardRouter = require('./routes/cardRouter');
const userRouter = require('./routes/userRouter');
const { pattern } = require('./routes/pattern');
// const { login, createUser } = require('./controllers/users');
const { PORT = 3000 } = process.env;
const app = express();

const limiter = userLimit({
  windowMs: 1000,
  max: 5,
});

// **подключение к БД
mongoose.connect('mongodb://localhost:27017/mestodb-14', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.log(err);
  });

// **функционал
app.use(limiter);
app.use(cors({ origin: true }));
// *парсеры
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// *фунция крэша сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// *логгер запросов
app.use(requestLogger);

// *регистрация
app.post('/signup', authRouter);
/* celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(new RegExp('https?:\/{2}\\S+\\.(jpg|png|gif|svg)')).required(),
  }),
}), createUser); */

// *логин
app.post('/signin', authRouter);
/* celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
  }),
}), login); */

// *мидлвэр аутентификации
app.use(auth);

// *подключение роутов
app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use('*', pattern);

// *обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next(err);
});

// *портирование
app.listen(PORT, () => {
  console.log('Server started');
});
