/* eslint-disable object-curly-newline */
// **импорты
const userRouter = require('express').Router();
const { login, createUser, getUsers, getCurrentUser, updateUser, updateAvatar } = require('../controllers/users');
// **роуты

userRouter.post('/signup', createUser);
userRouter.post('/signin', login);
// userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', getCurrentUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

// **экспорт
module.exports = userRouter;
