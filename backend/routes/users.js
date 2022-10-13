const usersRouter = require('express').Router();
const {
  getUsers, getUserById, getUserData, updateProfile, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUserData);
usersRouter.get('/users/:id', getUserById);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);
module.exports = usersRouter;
