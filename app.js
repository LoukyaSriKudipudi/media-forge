const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const app = express();
const cryptoFileRouter = require('./router/cryptoFileRouter');
const cryptoTextRouter = require('./router/cryptoTextRouter');
const bcryptRouter = require('./router/bcryptRouter');
const metadataRouter = require('./router/metadataRouter');
const sha256Router = require('./router/sha256Router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    status: 429,
    error: 'Too many requests. Please try again later.',
  },
});
app.use(limiter);

app.use('/cryptofile', cryptoFileRouter);
app.use('/cryptotext', cryptoTextRouter);
app.use('/bcrypt', bcryptRouter);
app.use('/metadata', metadataRouter);
app.use('/sha256', sha256Router);

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
