const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const expressRateLimit = require('express-rate-limit');
const routes = require('./routes/indexRoutes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PORT } = process.env;

const adress = process.env.DB_ADDRESS;

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const limit = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Превышен лимит запросов',
});

const app = express();

app.use(cors({ origin: 'https://films.nomoredomainsicu.ru/', credentials: true }));

app.use(express.json());

app.use(helmet());

app.use(limit);

app.use(cookieParser());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка в работе сервера'
        : message,
    });
  next();
});

app.listen(3000);
