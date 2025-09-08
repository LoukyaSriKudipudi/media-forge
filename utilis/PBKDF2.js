const crypto = require('crypto');

function PBKDF2(
  secret,
  salt,
  iterations = 100_000,
  keyLength = 32,
  digest = 'sha256'
) {
  return crypto.pbkdf2Sync(secret, salt, iterations, keyLength, digest);
}

function verifyPBKDF2(
  storedKey,
  passwordAttempt,
  salt,
  iterations = 100_000,
  keyLength = 32,
  digest = 'sha256'
) {
  const attemptKey = crypto.pbkdf2Sync(
    passwordAttempt,
    salt,
    iterations,
    keyLength,
    digest
  );

  return crypto.timingSafeEqual(storedKey, attemptKey);
}

module.exports = { PBKDF2, verifyPBKDF2 };
