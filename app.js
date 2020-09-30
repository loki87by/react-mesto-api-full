// **импорты
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const cardRouter = require('./routes/cardRouter');
const userRouter = require('./routes/userRouter');
const { pattern } = require('./routes/pattern');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

// **подключаемся к монго
mongoose.connect('mongodb://localhost:27017/mestodb-14', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// **функционал
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(new RegExp('https?:\/{2}\\S+\\.(jpg|png|gif|svg)')).required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
  }),
}), login);
app.use(auth);
app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use('*', pattern);
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
app.listen(PORT, () => {
  console.log('Server started');
});
