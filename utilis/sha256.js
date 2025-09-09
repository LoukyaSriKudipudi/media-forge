const crypto = require("crypto");
const fse = require("fs-extra");

function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex"); // return hex string
}

function verifySha256Text(text, expectedHash) {
  const computed = sha256Text(text);
  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fse.createReadStream(filePath);

    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex"))); // return hex string
    stream.on("error", reject);
  });
}

async function verifySha256File(filePath, expectedHash) {
  const computed = await sha256File(filePath);
  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

module.exports = {
  sha256Text,
  verifySha256Text,
  sha256File,
  verifySha256File,
};
