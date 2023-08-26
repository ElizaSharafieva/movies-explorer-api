const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

const {
  createUser,
  login,
  signout,
} = require('../controllers/userControllers');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signout', auth, signout);

router.use('/users', auth, userRoutes);

router.use('/movies', auth, movieRoutes);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не существует.'));
});

module.exports = router;
