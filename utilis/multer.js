const multer = require('multer');
const fse = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const uploadDir = path.join(__dirname, '..', 'original-files');
fse.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const limits = { fileSize: 50 * 1024 * 1024 };

const upload = multer({ storage, limits });
module.exports = upload;
