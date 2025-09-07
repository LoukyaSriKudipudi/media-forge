const express = require('express');
const router = express.Router();
const cryptoFileController = require('../crypto-controllers/cryptoFileController');
const upload = require('../utilis/multer');
router.post(
  '/encrypt',
  upload.single('file'),
  cryptoFileController.encryptFile
);

router.get(
  '/downloadEncryptedFile/:filename',
  cryptoFileController.sendEncryptedFile
);

router.post(
  '/decrypt',
  upload.single('file'),
  cryptoFileController.decryptFile
);

router.get(
  '/downloadDecryptedFile/:filename',
  cryptoFileController.sendDecryptedFile
);

module.exports = router;
