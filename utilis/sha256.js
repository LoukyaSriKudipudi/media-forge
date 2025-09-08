const crypto = require('crypto');
const fse = require('fs-extra');

function sha256TextBuffer(text) {
  return crypto.createHash('sha256').update(text).digest(); // returns Buffer
}

function verifySha256TextBuffer(text, expectedBuffer) {
  const computed = sha256TextBuffer(text);
  return crypto.timingSafeEqual(computed, expectedBuffer);
}

function sha256FileBuffer(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fse.createReadStream(filePath);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest())); // returns Buffer
    stream.on('error', reject);
  });
}

async function verifySha256FileBuffer(filePath, expectedBuffer) {
  const computed = await sha256FileBuffer(filePath);
  return crypto.timingSafeEqual(computed, expectedBuffer);
}

module.exports = {
  sha256TextBuffer,
  verifySha256TextBuffer,
  sha256FileBuffer,
  verifySha256FileBuffer,
};
