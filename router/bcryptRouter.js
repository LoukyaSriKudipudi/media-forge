const express = require('express');
const router = express.Router();
const bcryptController = require('../bcrypt-controllers/bcryptController');

router.post('/hash', bcryptController.hashSecret);
router.post('/verify', bcryptController.verifySecret);

module.exports = router;
