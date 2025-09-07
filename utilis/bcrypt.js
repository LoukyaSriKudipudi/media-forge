const bcrypt = require('bcrypt');

async function hashSecret(secret) {
  const hash = await bcrypt.hash(secret, 12);
  return hash;
}

async function verifySecret(secret, hashedSecret) {
  const isMatch = await bcrypt.compare(secret, hashedSecret);
  return isMatch;
}
module.exports = { hashSecret, verifySecret };
