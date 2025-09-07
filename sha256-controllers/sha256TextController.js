const { sha256Text, verifySha256Text } = require('../utilis/sha256');

exports.sha256HashText = (req, res) => {
  try {
    const text = req.body.sha256Text;

    if (!text) {
      return res.status(400).json({
        message: 'No text provided. Please enter text to hash.',
      });
    }

    const hash = sha256Text(text);

    return res.status(200).json({
      message: 'SHA-256 hash computed successfully.',
      computedHash: hash,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'An error occurred while hashing the text: ' + err.message,
    });
  }
};

exports.sha256VerifyText = (req, res) => {
  try {
    const { text, expectedHash } = req.body;

    if (!text || !expectedHash) {
      return res.status(400).json({
        message: 'Both text and expected hash are required for verification.',
      });
    }

    const isValid = verifySha256Text(text, expectedHash);

    return res.status(200).json({
      message: isValid
        ? 'The text matches the provided SHA-256 hash.'
        : 'The text does NOT match the provided SHA-256 hash.',
      valid: isValid,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'An error occurred during verification: ' + err.message,
    });
  }
};
