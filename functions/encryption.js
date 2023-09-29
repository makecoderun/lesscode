import CryptoJS from "crypto-js";
var jwt = require("jsonwebtoken");

export const encrypt = (value, SECRET_KEY) => {
  try {
    if (!value) {
      return null;
    }
    return CryptoJS.AES.encrypt(
      value,
      SECRET_KEY || process.env.SECRET_KEY
    ).toString();
  } catch (error) {
    console.error("Encyption/Decrption Error: ", error.message);
  }
};
export const decrypt = (hash, SECRET_KEY) => {
  try {
    if (!hash) return;
    const bytes = CryptoJS.AES.decrypt(
      hash,
      SECRET_KEY || process.env.SECRET_KEY
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Encyption/Decrption Error: ", error.message);
  }
};
export const encryptSHA256 = (value) => {
  try {
    if (!value) {
      return null;
    }
    return CryptoJS.SHA256(value).toString();
  } catch (error) {
    console.error("Encyption/Decrption Error: ", error.message);
  }
};

export const jwtSign = (value, JWT_SECRET) => {
  return jwt.sign(value, JWT_SECRET || process.env.JWT_SECRET);
};
export const jwtVerify = (value, JWT_SECRET) => {
  return jwt.verify(value, JWT_SECRET || process.env.JWT_SECRET);
};
