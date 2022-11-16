const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
} = require('../controllers/cards');
const { createCardValidator, cardIdValidator } = require('../middleware/celebrateValidators');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCardValidator, createCard);
cardsRouter.delete('/cards/:cardId', cardIdValidator, deleteCard);
cardsRouter.put('/cards/:cardId/likes', cardIdValidator, likeCard);
cardsRouter.delete('/cards/:cardId/likes', cardIdValidator, unlikeCard);

module.exports = cardsRouter;
