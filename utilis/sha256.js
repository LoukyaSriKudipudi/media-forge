const crypto = require('crypto');
const fse = require('fs-extra');
function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function verifySha256Text(text, expectedHash) {
  const computedHash = sha256Text(text);
  return computedHash === expectedHash.toLowerCase();
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fse.createReadStream(filePath);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function verifySha256File(filePath, expectedHash) {
  const computedHash = await sha256File(filePath);
  return computedHash === expectedHash.toLowerCase(); // normalize case
}

module.exports = { sha256Text, verifySha256Text, sha256File, verifySha256File };
