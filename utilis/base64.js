const fse = require('fs-extra');
const { fileTypeFromBuffer } = require('file-type');

function fileToBase64(inputFilePath, outputFilePath) {
  const buffer = fse.readFileSync(inputFilePath);
  const output = buffer.toString('base64');
  fse.writeFileSync(outputFilePath, output);
  return outputFilePath;
}

async function base64ToFile(inputFilePath, outputFilePath) {
  const base64String = fse.readFileSync(inputFilePath, 'utf8');
  const buffer = Buffer.from(base64String, 'base64');

  const type = await fileTypeFromBuffer(buffer);
  if (!type) {
    fse.writeFileSync(outputFilePath + '.bin', buffer);
    return outputFilePath + '.bin';
  }

  const base64ToFileFinalPath = `${outputFilePath}.${type.ext}`;
  fse.writeFileSync(base64ToFileFinalPath, buffer);
  return base64ToFileFinalPath;
}

module.exports = { fileToBase64, base64ToFile };
