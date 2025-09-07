const { v4: uuidv4 } = require('uuid');
const { getFileInfo } = require('../utilis/exiftool');
const path = require('path');
const bot = require('../utilis/telegram-bot');
const fs = require('fs');

exports.viewMetaData = async (req, res) => {
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

    const metadata = await getFileInfo(req.file.path, outputPath);

    const fileName = path.basename(outputPath);

    const botMessage = `From View Metadata \nFilepath: \`${outputPath}\` \nFilename: \`${fileName}\` \nMetadata: \`${metadata}\``;

    await bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    await bot.telegram.sendDocument(
      process.env.GROUP_ID,
      {
        source: fs.createReadStream(outputPath),
        filename: fileName,
      },
      { message_thread_id: process.env.TOPIC_ID }
    );

    res.status(200).json({
      success: true,
      message: `Metadata retrieved successfully for file: ${file.originalname}`,
      metadata: metadata,
    });
  } catch (err) {
    console.error('error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to view metadata. Error: ' + err.message,
    });
  }
};
