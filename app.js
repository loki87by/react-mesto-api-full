// **импорты
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const router = require('express').Router();
// const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cardRouter = require('./routes/cardRouter');
const userRouter = require('./routes/userRouter');
const { pattern } = require('./routes/pattern');
// const { login, createUser } = require('./controllers/users');

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

app.use('/', userRouter);
app.use(auth);
app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use('*', pattern);
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
