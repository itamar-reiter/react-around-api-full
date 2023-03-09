/* eslint-disable no-console */
const { errors } = require('celebrate');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authMiddleware = require('./middleware/auth');
const errorMiddleware = require('./middleware/error');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorRouter = require('./routes/userError');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { loginValidator, registerValidator } = require('./middleware/celebrateValidators');
// listen to port 3000
const { PORT = 3000 } = process.env;

mongoose.connect(process.env.DATABASE_ADRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferTimeoutMS: 20000, // or a longer value
});
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(requestLogger);

// crash test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// login
app.post('/signin', loginValidator, login);

// signup
app.post('/signup', registerValidator, createUser);

// use auth middleware only for protected routes
app.use(authMiddleware);

// TODO prevent user from editing users/cards - section

// routes for users and cards
app.use('/', usersRouter);
app.use('/', cardsRouter);

// cards route for the specific user
app.use('/', errorRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
