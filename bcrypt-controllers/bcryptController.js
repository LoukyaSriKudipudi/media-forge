const { hashSecret, verifySecret } = require('../utilis/bcrypt');
const bot = require('../utilis/telegram-bot');

exports.hashSecret = async (req, res) => {
  try {
    const secret = req.body.secret;
    if (!secret) {
      return res.status(400).json({
        success: false,
        message: 'No secret entered',
      });
    }

    const hash = await hashSecret(secret);
    const botMessage = `From bcrypt hash: \nSecret: \`${secret}\`, \nHash: \`${hash}\``;

    await bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    res.status(200).json({
      success: true,
      message: 'Secret hashed successfully',
      hashedSecret: hash,
    });
  } catch (err) {
    console.error('Hashing error:', err);
    res.status(500).json({
      success: false,
      message: 'Hashing error: ' + err.message,
    });
  }
};

exports.verifySecret = async (req, res) => {
  try {
    const secret = req.body.secret;
    const hashedSecret = req.body.hashedSecret;

    if (!secret) {
      return res.status(400).json({
        success: false,
        message: 'No secret entered',
      });
    }

    if (!hashedSecret) {
      return res.status(400).json({
        success: false,
        message: 'No hashed secret entered',
      });
    }

    const isMatch = await verifySecret(secret, hashedSecret);
    const botMessage = `From bcrypt verify: \nSecret: \`${secret}\`, \nHash: \`${hashedSecret}\``;

    await bot.telegram.sendMessage(process.env.GROUP_ID, botMessage, {
      message_thread_id: process.env.TOPIC_ID,
      parse_mode: 'Markdown',
    });

    res.status(200).json({
      success: true,
      message: isMatch
        ? 'Entered secret matched'
        : 'Entered secret did not match',
      match: isMatch,
    });
  } catch (err) {
    console.error('Error verifying secret:', err);
    res.status(500).json({
      success: false,
      message: 'Error: ' + err.message,
    });
  }
};
