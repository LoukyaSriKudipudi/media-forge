const { exiftool } = require('exiftool-vendored');
const fse = require('fs-extra');

async function removeMetaData(inputFilePath, outputFilePath) {
  try {
    await fse.copy(inputFilePath, outputFilePath);

    await exiftool.write(outputFilePath, {
      All: '',
      'XMP:All': '',
      'IPTC:All': '',
      'EXIF:All': '',
      'GPS:All': '',
      ICC_Profile: '',
      ThumbnailImage: '',
    });
  } catch (err) {
    console.error('Error removing metadata:', err);
    throw err;
  }
}

async function getFileInfo(inputFilePath, outputFilePath) {
  try {
    await fse.copy(inputFilePath, outputFilePath);
    const data = await exiftool.read(outputFilePath, {
    all: true,
    includeUnknown: true,
    group: true,
  });

    const metadata = { ...data };
    delete metadata.SourceFile;
    delete metadata.Directory;

    return metadata; // return metadata directly
  } catch (err) {
    console.error('Error retrieving metadata:', err);
    throw err;
  }
}

module.exports = { removeMetaData, getFileInfo };
