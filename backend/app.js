/* eslint-disable no-console */
const {errors} = require('celebrate');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authMiddleware = require('./middleware/auth');
const errorMiddleware = require('./middleware/error');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorRouter = require('./routes/userError');
const {login, createUser} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middleware/logger');
// listen to port 3000
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(requestLogger);

//login
app.post('/signin', login);

//signup
app.post('/signup', createUser);

//use auth middleware only for protected routes
app.use(authMiddleware);

//routes for users and cards
//TODO prevent user from editing users/cards - section 9
app.use('/', usersRouter);
app.use('/', errorRouter);

// cards route for the specific user
app.use('/', cardsRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
