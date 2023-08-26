const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movieControllers');

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(pattern),
    trailerLink: Joi.string().required().pattern(pattern),
    thumbnail: Joi.string().required().pattern(pattern),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required().pattern(/^[а-яА-Я]+/m),
    nameEN: Joi.string().required().pattern(/^[a-zA-Z]+/m),
  }),
}), createMovie);

router.get('/', getMovies);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
