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

app.use((req, res, next) => {
  req.user = {
    _id: '62b8498215fdd672ace5a4ad', // paste the _id of the test user created in the previous step
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', usersRouter);
app.use('/', errorRouter);
app.use(auth);
app.use('/', cardsRouter);
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
