const express = require('express');
const router = express.Router();
const metaDataRemoveController = require('../metadata-controllers/metaDataRemoveController');
const metaDataViewController = require('../metadata-controllers/metaDataViewController');
const upload = require('../utilis/multer');

router.post(
  '/remove',
  upload.single('file'),
  metaDataRemoveController.removeMetaData
);
router.get(
  '/downloadNoMeta/:filename',
  metaDataRemoveController.sendNoMetaFile
);

router.post(
  '/view',
  upload.single('file'),
  metaDataViewController.viewMetaData
);

module.exports = router;
