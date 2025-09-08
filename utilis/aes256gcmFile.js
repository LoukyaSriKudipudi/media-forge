const crypto = require('crypto');
const fse = require('fs-extra');
const path = require('path');

function scryptKey(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

async function encryptFile(password, inputFile, outputPath) {
  const fileBuffer = fse.readFileSync(inputFile);
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);
  const key = await scryptKey(password, salt);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  fse.ensureDirSync(path.dirname(outputPath));

  const encryptedFile = Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();
  const encryptedPackage = Buffer.concat([iv, salt, encryptedFile, authTag]);

  fse.writeFileSync(outputPath, encryptedPackage);
}

async function decryptFile(password, inputFile, outputPath) {
  const fileBuffer = fse.readFileSync(inputFile);
  const iv = fileBuffer.subarray(0, 12);
  const salt = fileBuffer.subarray(12, 28);
  const key = await scryptKey(password, salt);
  const encryptedFile = fileBuffer.subarray(28, fileBuffer.length - 16);
  const authTag = fileBuffer.subarray(fileBuffer.length - 16);

  fse.ensureDirSync(path.dirname(outputPath));

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const decryptedFile = Buffer.concat([
    decipher.update(encryptedFile),
    decipher.final(),
  ]);

  fse.writeFileSync(outputPath, decryptedFile);
}

module.exports = { encryptFile, decryptFile };
