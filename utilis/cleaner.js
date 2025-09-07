const fse = require('fs-extra');
const path = require('path');

const modifiedFiles = path.join(__dirname, '..', 'modified-files');
const maxTimeModifiedFiles = 5 * 60 * 1000;

async function cleanOldModifiedFiles() {
  try {
    if (!(await fse.pathExists(modifiedFiles))) return;

    const files = await fse.readdir(modifiedFiles);
    const now = Date.now();

    for (const file of files) {
      const filepath = path.join(modifiedFiles, file);
      const stats = await fse.stat(filepath);
      const age = now - stats.mtimeMs;

      if (age > maxTimeModifiedFiles) {
        await fse.remove(filepath);
        console.log(`Deleted old modified file: ${file}`);
      }
    }
  } catch (err) {
    console.error('Error cleaning modified files:', err);
  }
}

const originalFiles = path.join(__dirname, '..', 'original-files');
const maxTimeOriginalFiles = 5 * 60 * 1000;

async function cleanOriginalFiles() {
  try {
    if (!(await fse.pathExists(originalFiles))) return;

    const files = await fse.readdir(originalFiles);
    const now = Date.now();

    for (const file of files) {
      const filepath = path.join(originalFiles, file);
      const stats = await fse.stat(filepath);
      const age = now - stats.mtimeMs;

      if (age > maxTimeOriginalFiles) {
        await fse.remove(filepath);
        console.log(`Deleted old original file: ${file}`);
      }
    }
  } catch (err) {
    console.error('Error cleaning original files:', err);
  }
}

setInterval(cleanOldModifiedFiles, 5 * 60 * 1000);
setInterval(cleanOriginalFiles, 5 * 60 * 1000);

module.exports = { cleanOldModifiedFiles, cleanOriginalFiles };
