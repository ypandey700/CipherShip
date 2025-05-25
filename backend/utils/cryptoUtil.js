const crypto = require("crypto");

const algorithm = "aes-256-cbc";
// Use a secure 32-byte key from environment variable (hex string) or fallback (for dev/testing)
const secretKeyHex = process.env.SECRET_KEY || "12345678901234567890123456789012"; 
// Normalize key: if 32 bytes hex string, use hex buffer, else fallback to utf8 buffer
const isHexKey = /^[0-9a-fA-F]{64}$/.test(secretKeyHex);
const key = isHexKey ? Buffer.from(secretKeyHex, "hex") : Buffer.from(secretKeyHex, "utf8");

// Encrypt plaintext with AES-256-CBC and a random 16-byte IV
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  // Return iv + ciphertext as hex strings separated by ":"
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Decrypt ciphertext string formatted as "ivHex:cipherHex"
function decrypt(encryptedData) {
  try {
    const [ivHex, encryptedHex] = encryptedData.split(":");
    if (!ivHex || !encryptedHex) throw new Error("Invalid encrypted data format");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (err) {
    throw new Error("Decryption failed: Invalid data or key");
  }
}

// Generate a secure random 32-byte key as hex string (64 chars)
function generateKey() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = { encrypt, decrypt, generateKey };
