const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  getUserData,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const {
  getUserDataValidator,
  getUserByIdValidator,
  updateProfileValidator,
  updateAvatarValidator,
} = require('../middleware/celebrateValidators');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUserDataValidator, getUserData);
usersRouter.get('/users/:id', getUserByIdValidator, getUserById);
usersRouter.patch('/users/me', updateProfileValidator, updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatarValidator, updateAvatar);

module.exports = usersRouter;
