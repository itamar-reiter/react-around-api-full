/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./middleware/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorRouter = require('./routes/userError');
const {login, createUser} = require('./controllers/users');
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

//login
app.post('/signin', login);

//signup
app.post('/signup', createUser);

//use auth middleware only for protected routes
app.use(auth);

//routes for users and cards
app.use('/', usersRouter);
app.use('/', errorRouter);

// cards route for the specific user
app.use('/', cardsRouter);
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
