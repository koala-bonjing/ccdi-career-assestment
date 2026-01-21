import CryptoJS from "crypto-js";

// Fallback to a string or a warning to prevent 'undefined' issues
const SECRET_KEY =
  import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || "fallback-secret-key";

export const StorageEncryptor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem: (key: string, data: any) => {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
      console.error("Encryption failed", e);
    }
  },

  getItem: (key: string) => {
    const encryptedData = localStorage.getItem(key);

    if (!encryptedData) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      // If decryption fails to produce a string, it might return empty or throw
      if (!decryptedString) {
        throw new Error(
          "Decryption produced empty string (possibly wrong key)",
        );
      }

      return JSON.parse(decryptedString);
    } catch (error) {
      // This is where your "Malformed UTF-8" is caught
      console.warn(
        `StorageEncryptor: Could not decrypt key "${key}". Clearing corrupted data. `,
        error,
      );
      localStorage.removeItem(key); // Optional: clear it so it doesn't fail next time
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
