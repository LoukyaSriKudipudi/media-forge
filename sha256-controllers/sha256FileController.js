const { sha256File, verifySha256File } = require('../utilis/sha256');

exports.sha256HashFile = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const hash = await sha256File(req.file.path);

    return res.status(200).json({
      message: 'SHA-256 hash computed successfully.',
      computedHash: hash,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error while hashing the file: ' + err.message,
    });
  }
};

exports.sha256VerifyFile = async (req, res) => {
  try {
    const { expectedHash } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    if (!expectedHash) {
      return res.status(400).json({ message: 'Expected hash is required.' });
    }

    const isValid = await verifySha256File(req.file.path, expectedHash);

    return res.status(200).json({
      message: isValid
        ? 'The file matches the provided SHA-256 hash.'
        : 'The file does NOT match the provided SHA-256 hash.',
      valid: isValid,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error during file verification: ' + err.message,
    });
  }
};
