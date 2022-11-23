/* eslint-disable no-console */
const Cards = require('../models/card');
const { NOT_FOUND_ERROR_CODE } = require('../utils/errors/errorCodes');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const InvalidDataError = require('../utils/errors/InvalidDataError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ServerError = require('../utils/errors/ServerError');

const getCards = (req, res, next) => Cards.find({})
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch(next);

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'ValidationError') {
        next(new InvalidDataError('ValidationError: invalid image url or an item is missing.'));
      } else {
        next(new ServerError());
      }
    });
};

// TODO - only card owner should be able to delete the card
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findOne({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError(`not found card with ${cardId} id`);
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new UnauthorizedError("You can't delete this card"));
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'card has been deleted' }));
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        next(new InvalidDataError('invalid user id'));
      } else if (error.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError('Card not found'));
      } else {
        next(new ServerError());
      }
    });
};

const toggleCardLike = (req, res, next, isLike) => {
  const id = req.user._id;
  const { cardId } = req.params;
  const method = isLike ? { $addToSet: { likes: id } } : { $pull: { likes: id } };
  Cards.findOneAndUpdate(
    { _id: cardId },
    method,
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        next(new InvalidDataError('invalid user id'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Card not found'));
      } else {
        next(new ServerError());
      }
    });
};

const likeCard = (req, res, next) => toggleCardLike(req, res, next, true);

const unlikeCard = (req, res, next) => toggleCardLike(req, res, next, false);
module.exports = {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
};
