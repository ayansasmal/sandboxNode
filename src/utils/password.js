// Nodejs encryption with CTR
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = "Ayansasmalisthecreatoroftheappli";

const encrypt = (text, providedIV) => {
  let iv = crypto.randomBytes(16);
  if (providedIV) {
    iv = Buffer.from(providedIV, "hex");
  }
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

const decrypt = text => {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.upate(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export default { encrypt, decrypt };
