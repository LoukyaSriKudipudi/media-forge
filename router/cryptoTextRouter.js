const express = require('express');
const router = express.Router();
const cryptoTextController = require('../crypto-controllers/cryptoTextController');
router.post('/encrypt', cryptoTextController.encryptText);
router.post('/decrypt', cryptoTextController.decryptText);
module.exports = router;
