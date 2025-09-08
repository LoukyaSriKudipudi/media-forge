const crypto = require('crypto');

function scryptKey(
  secret,
  salt,
  keyLength = 32,
  options = { N: 16384, r: 8, p: 1 }
) {
  const derivedKey = crypto.scryptSync(secret, salt, keyLength, options);
  return derivedKey;
}

function verifyScrypt(
  storedKey,
  passwordAttempt,
  salt,
  keyLength = 32,
  options = { N: 16384, r: 8, p: 1 }
) {
  const attemptKey = crypto.scryptSync(
    passwordAttempt,
    salt,
    keyLength,
    options
  );
  return crypto.timingSafeEqual(storedKey, attemptKey);
}

module.exports = { scryptKey, verifyScrypt };
