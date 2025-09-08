const argon2 = require('argon2');

async function argonHashPassword(password) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.error(err);
  }
}

async function argonVerifyPassword(hash, passwordAttempt) {
  try {
    const valid = await argon2.verify(hash, passwordAttempt);
    return valid;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { argonHashPassword, argonVerifyPassword };
