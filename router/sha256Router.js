const express = require('express');
const router = express();
const sha256TextController = require('../sha256-controllers/sha256TextController');
const sha256FileController = require('../sha256-controllers/sha256FileController');
const upload = require('../utilis/multer');

router.post('/hashText', sha256TextController.sha256HashText);
router.post('/verifyText', sha256TextController.sha256VerifyText);
router.post(
  '/hashFile',
  upload.single('file'),
  sha256FileController.sha256HashFile
);
router.post(
  '/verifyFile',
  upload.single('file'),
  sha256FileController.sha256VerifyFile
);

module.exports = router;
