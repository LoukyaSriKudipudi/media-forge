const argon2 = require('argon2');

async function argon2KDF(secret, salt, options = {}) {
  const defaultOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
    raw: true,
  };

  const config = { ...defaultOptions, ...options, salt: Buffer.from(salt) };
  const key = await argon2.hash(secret, config);

  return key;
}

const crypto = require('crypto');

async function verifyArgon2KDF(storedKey, secretAttempt, salt, options = {}) {
  const derivedAttempt = await argon2KDF(secretAttempt, salt, options);

  const storedBuffer = Buffer.from(storedKey);
  const attemptBuffer = Buffer.from(derivedAttempt);

  if (storedBuffer.length !== attemptBuffer.length) return false;
  return crypto.timingSafeEqual(storedBuffer, attemptBuffer);
}

module.exports = { argon2KDF, verifyArgon2KDF };
