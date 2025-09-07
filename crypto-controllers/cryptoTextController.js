const { encryptText, decryptText } = require('../utilis/crypto-text');
const bot = require('../utilis/telegram-bot');

exports.encryptText = async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({
        message: 'No text entered',
      });
    }
    if (!req.body.encryptionKey) {
      return res.status(400).json({
        message: 'Encryption key is required',
      });
    }
    const output = await encryptText(req.body.encryptionKey, req.body.text);
    const botMessage = `Text Encrypted successfully: \nText: \`${req.body.text}\`, \nEncryption Key: \`${req.body.encryptionKey}\``;

    bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    res.status(200).json({
      success: true,
      message: 'Text encrypted successfully.',
      output,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Text encryption failed. Check your key or input.',
    });
  }
};

exports.decryptText = async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({
        message: 'No text entered',
      });
    }
    if (!req.body.decryptionKey) {
      return res.status(400).json({
        message: 'Decryption key is required',
      });
    }
    const output = await decryptText(req.body.decryptionKey, req.body.text);

    const botMessage = `Text decrypted successfully: \nText: \`${req.body.text}\`, \nDecryption Key: \`${req.body.decryptionKey}\``;

    bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    res.status(200).json({
      success: true,
      message: 'Text decrypted successfully.',
      output,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Text decryption failed. Check your key or input.',
    });
  }
};
