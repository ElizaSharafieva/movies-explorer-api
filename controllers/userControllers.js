const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const BadRequestError = require('../errors/BadRequestError');
const ConflictRequestError = require('../errors/ConflictRequestError');

const { JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictRequestError('Такой пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then(((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET || 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ _id: user._id });
    }))
    .catch(next);
};

const signout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => { res.status(200).send(user); })
  .catch(next);

const updateUserInform = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else if (error.code === 11000) {
        next(new ConflictRequestError('Такой пользователь уже существует'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createUser,
  login,
  signout,
  getCurrentUser,
  updateUserInform,
};
