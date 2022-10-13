/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorRouter = require('./routes/userError');
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

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/', errorRouter);
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
