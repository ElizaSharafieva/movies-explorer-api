const Movie = require('../models/movieSchema');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailerLink,
    thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {

        next(error);
      }
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      } else if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params._id)
          .then(() => { res.send(movie); })
          .catch((err) => next(err));
      } else { throw new ForbiddenError('У вас нет прав на удаление данной карточки'); }
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
