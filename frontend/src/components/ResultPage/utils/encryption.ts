import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_STORAGE_ENCRYPTION_KEY;

export const StorageEncryptor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem: (key: string, data: any) => {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();

    localStorage.setItem(key, encrypted);
  },

  getItem: (key: string) => {
    const encryptData = localStorage.getItem(key);

    if (!encryptData) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptData, key);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("Decrypted failed", error);
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
