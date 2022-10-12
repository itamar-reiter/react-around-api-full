// const { Types } = require('mongoose');
const Cards = require('../models/card');
const { defaultError, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE } = require('../utils/errors');

const getCards = (req, res) => Cards.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(() => defaultError(res));

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(INVALID_DATA_ERROR_CODE).send({
          message: `
        ${error.name}: invalid image url or an item is missing.
        `,
        });
      } else {
        defaultError(res);
      }
    });
};

const deleteCard = (req, res) => {
  const id = req.params.cardId;
  Cards.findByIdAndRemove(id)
    .orFail(() => {
      const error = new Error(`not found card with ${id} id`);
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(INVALID_DATA_ERROR_CODE).send({ message: 'invalid user id' });
      } else if (error.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Card not found',
        });
      } else {
        defaultError(res);
      }
    });
};

const toggleCardLike = (req, res, isLike) => {
  const id = req.user._id;
  const method = isLike ? { $addToSet: { likes: id } } : { $pull: { likes: id } };
  Cards.findByIdAndUpdate(
    req.params.cardId,
    method,
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(INVALID_DATA_ERROR_CODE).send({ message: 'invalid user id' });
      } else if (error.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Card not found',
        });
      } else {
        defaultError(res);
      }
    });
};

const likeCard = (req, res) => toggleCardLike(req, res, true);

const unlikeCard = (req, res) => toggleCardLike(req, res, false);
module.exports = {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
};
