const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const { createId } = require('@paralleldrive/cuid2');
const { ulid } = require('ulid');
const fse = require('fs-extra');

function getUUIDv4() {
  return uuidv4();
}

function getCryptoUUID() {
  return crypto.randomUUID();
}

function getNanoID(length = 21) {
  return nanoid(length);
}

function getCUID() {
  return createId();
}

function getULID() {
  return ulid();
}

function getRandomHex(bytes = 16) {
  return crypto.randomBytes(bytes).toString('hex');
}

function getRandomInt(min, max) {
  return crypto.randomInt(min, max);
}

function getRandomFill(length) {
  const buffer = Buffer.alloc(length);
  crypto.randomFill(buffer, (err, buf) => {
    if (err) throw err;
    return buf.toString('hex');
  });
}

function getUnit8RandomFillArray(length, start = 0, end) {
  if (end) (end = end) || (end = length);
  const arr = new Uint8Array(length);
  crypto.randomFillSync(arr, start, end);
  return arr;
}

function unit8TextEncoder(text) {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

function unit8TextDecoder(bytes) {
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

module.exports = {
  getUUIDv4,
  getCryptoUUID,
  getNanoID,
  getCUID,
  getULID,
  getRandomHex,
  getRandomInt,
  getRandomFill,
  getUnit8RandomFillArray,
  unit8TextEncoder,
  unit8TextDecoder,
};
