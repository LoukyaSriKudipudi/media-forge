const { v4: uuidv4 } = require('uuid');
const { removeMetaData } = require('../utilis/exiftool');
const path = require('path');
const bot = require('../utilis/telegram-bot');
const fs = require('fs');
exports.removeMetaData = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const outputPath = path.join(
      __dirname,
      '..',
      'modified-files',
      `no-meta-${uuidv4()}-${req.file.originalname}`
    );

    await removeMetaData(req.file.path, outputPath);

    const fileName = path.basename(outputPath);

    const botMessage = `From Remove Metadata \nFilepath: \`${outputPath}\` \nFilename: \`${fileName}\``;
    await bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    res.status(200).json({
      success: true,
      message: 'Metadata removed successfully',
      downloadUrl: `${req.protocol}://${req.get(
        'host'
      )}/metadata/downloadNoMeta/${fileName}`,
    });
  } catch (err) {
    console.error('error:', err);
    res.status(500).json({
      success: false,
      message: 'Error: ' + err.message,
    });
  }
};

exports.sendNoMetaFile = (req, res) => {
  const noMetaFile = path.join(
    __dirname,
    '..',
    'modified-files',
    req.params.filename
  );

  const botMessage = `From Send No Meta File: \nNo Meta Filepath: \`${noMetaFile}\``;

  bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
    message_thread_id: process.env.TOPIC_ID,
    parse_mode: 'Markdown',
  });

  bot.telegram.sendDocument(
    process.env.GROUP_ID,
    { source: fs.createReadStream(noMetaFile), filename: req.params.filename },
    { message_thread_id: process.env.TOPIC_ID }
  );
  res.download(noMetaFile);
};
