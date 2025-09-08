const { encryptFile, decryptFile } = require('../utilis/aes256gcmFile');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bot = require('../utilis/telegram-bot');
const fs = require('fs');

exports.encryptFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    if (!req.body.encryptionKey) {
      return res.status(400).json({
        message: 'Encryption key is required',
      });
    }

    const outputPath = path.join(
      __dirname,
      '..',
      'modified-files',
      `encrypted-${uuidv4()}-${req.file.originalname}`
    );

    await encryptFile(req.body.encryptionKey, req.file.path, outputPath);

    const fileName = path.basename(outputPath);

    const botMessage = `File encrypted successfully: \nOutput Path: \`${outputPath}\`, \nEncryption Key: \`${req.body.encryptionKey}\` \nFile Name: \`${fileName}\``;

    await bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    res.json({
      success: true,
      message: 'File encrypted successfully.',
      downloadUrl: `${req.protocol}://${req.get(
        'host'
      )}/cryptofile/downloadEncryptedFile/${fileName}`,
    });
  } catch (err) {
    console.error('File encryption error:', err);
    res.status(500).json({
      success: false,
      message: 'File encryption failed. Please check your key or file.',
    });
  }
};

exports.sendEncryptedFile = (req, res) => {
  const filePath = path.join(
    __dirname,
    '..',
    'modified-files',
    req.params.filename
  );

  const botMessage = `Encrypted file sent successfully: \nFile Path: \`${filePath}\``;

  bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
    message_thread_id: process.env.TOPIC_ID,
    parse_mode: 'Markdown',
  });

  bot.telegram.sendDocument(
    process.env.GROUP_ID,
    { source: fs.createReadStream(filePath), filename: req.params.filename },
    { message_thread_id: process.env.TOPIC_ID }
  );

  res.download(filePath);
};

exports.decryptFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    if (!req.body.decryptionKey) {
      return res.status(400).json({
        message: 'Decryption key is required',
      });
    }

    const outputPath = path.join(
      __dirname,
      '..',
      'modified-files',
      `decrypted-${uuidv4()}-${req.file.originalname}`
    );

    await decryptFile(req.body.decryptionKey, req.file.path, outputPath);

    const fileName = path.basename(outputPath);

    const botMessage = `File decrypted successfully: \nOutput Path: \`${outputPath}\`, \nDecryption Key: \`${req.body.decryptionKey}\` \nFile Name: \`${fileName}\``;

    await bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    res.json({
      success: true,
      message: 'File decrypted successfully.',
      downloadUrl: `${req.protocol}://${req.get(
        'host'
      )}/cryptofile/downloadDecryptedFile/${fileName}`,
    });
  } catch (err) {
    console.error('File decryption error:', err);
    res.status(500).json({
      success: false,
      message: 'File decryption failed. Please check your key or file.',
    });
  }
};

exports.sendDecryptedFile = (req, res) => {
  const filePath = path.join(
    __dirname,
    '..',
    'modified-files',
    req.params.filename
  );

  const botMessage = `Decrypted file sent successfully: \nFile Path: \`${filePath}\``;

  bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
    message_thread_id: process.env.TOPIC_ID,
    parse_mode: 'Markdown',
  });

  bot.telegram.sendDocument(
    process.env.GROUP_ID,
    { source: fs.createReadStream(filePath), filename: req.params.filename },
    { message_thread_id: process.env.TOPIC_ID }
  );

  res.download(filePath);
};
