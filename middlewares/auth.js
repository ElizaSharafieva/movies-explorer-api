const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET || 'secret-key');
  } catch {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
module.exports = auth;
