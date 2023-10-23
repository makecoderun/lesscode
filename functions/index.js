const { defaultResponseMessage, successCode } = require("../constants");
const {
  base64Regex,
  emailRegex,
  passwordRegex,
  urlRegex,
  usernameRegex,
} = require("../regex");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

/* Normal Functions Starts */
const isURL = (url, useRegex) => {
  try {
    if (useRegex) {
      return urlRegex.test(url);
    }
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
const getImageType = async (imageData) => {
  if (typeof imageData !== "string") {
    throw new Error("Invalid image data provided.");
  }

  if (imageData.startsWith("data:image/")) {
    const matches = imageData.match(/^data:image\/(\w+);base64,/);
    if (matches && matches.length > 1) {
      return matches[1];
    }
  } else {
    try {
      const response = await fetch(imageData, {
        method: "HEAD",
      });

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        const matches = contentType.match(/^image\/(\w+)/);
        if (matches && matches.length > 1) {
          return matches[1];
        }
      }
    } catch (err) {
      console.error("Error fetching image URL:", err.message);
      return null;
    }
  }

  return null;
};
const isBase64 = (item) => {
  return base64Regex.test(item);
};
const getCommonItems = (selected, available) => {
  // Create a Set from available for faster lookup
  const availableSet = new Set(available);

  // Use filter and Set.has for efficient intersection
  const commonFiles = selected.filter((file) => availableSet.has(file));

  return commonFiles;
};
const binarySearch = (sortedArr, target) => {
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (sortedArr[mid] === target) {
      return mid;
    } else if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
};
const isDate = (value) => {
  console.log(value instanceof Date, !isNaN(value));
  return value instanceof Date && !isNaN(value);
};
const formatCurrency = (amount, currency, options) => {
  const formatter = new Intl.NumberFormat(options?.locales || "en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: options?.minimumFractionDigits || 2,
  });
  return formatter.format(amount);
};
const formatNumber = (num) => {
  if (typeof num === "number") {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + "cr";
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + "lakh";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num?.toString();
    }
  }

  return num ? num : "N/A";
};
const formatDate = (dateString) => {
  if (!dateString) {
    return {
      year: null,
      month: null,
      day: null,
      hours: null,
      minutes: null,
      seconds: null,
    };
  }

  const date = new Date(dateString);

  // Get individual date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return { year, month, day, hours, minutes, seconds };
};
const validateInputs = (field) => {
  const itemName = field.placeholder || field.label;

  let error = { hasError: false, message: "" };

  // Validate each form field
  let errorMessage = "";

  switch (field.name) {
    case "username":
      if (!field.value && field.required) {
        errorMessage = "username is required";
      } else if (!usernameRegex.test(field.value) && field.required) {
        errorMessage = "Invalid username";
      }
      break;
    case "email":
      if (!field.value && field.required) {
        errorMessage = "Email is required";
      } else if (!emailRegex.test(field.value) && field.required) {
        errorMessage = "Invalid email address";
      }
      break;
    case "password":
    case "oldPassword":
    case "newPassword":
    case "confirmPassword":
      if (!field.value && field.required) {
        errorMessage = `${itemName} is required`;
      } else if (!passwordRegex.test(field.value) && field.required) {
        errorMessage =
          "Password must be at least 8 characters long and contain at least 1 letter, and 1 number";
      }
      break;
    default:
      if (!field.value && field.required) {
        errorMessage = `${itemName} is required`;
      }
  }

  if (errorMessage) {
    error = { hasError: true, message: errorMessage };
  } else {
    error = { hasError: false, message: "" };
  }

  // Return the validation status
  return error;
};

// Device Function
const getDeviceType = () => {
  try {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/mobile|iphone|ipad|android/.test(userAgent)) {
      return "mobile";
    } else if (/tablet|ipad/.test(userAgent)) {
      return "tablet";
    } else {
      return "pc";
    }
  } catch (error) {
    console.error("Error in getting device type: ", error.message);
  }
};

// For React/Next.js Frontend
const getError = (error) => {
  for (let err in error) {
    if (error[err].hasError === true) {
      return error[err];
    }

    if (error[err].hasError === undefined && typeof error[err] === "object") {
      const hasNestedError = getError(error[err]);
      if (hasNestedError && hasNestedError.hasError === true) {
        return hasNestedError;
      }
    }
  }

  return errObj();
};
const errObj = (errorCondition, message) => {
  return {
    hasError: Boolean(errorCondition),
    message: !errorCondition ? "" : message,
  };
};
const handleState = (setState, value, name, subField) => {
  setState &&
    setState((prev) => {
      if (!name && !subField) {
        return value === "reverse_value" ? !prev : value;
      }

      const temp = { ...prev };
      if (name && subField) {
        temp[subField][name] =
          value === "reverse_value" ? !prev[subField][name] : value;
      }
      if (name && !subField) {
        temp[name] = value === "reverse_value" ? !prev[name] : value;
      }
      return temp;
    });

  return Boolean(setState);
};
/* Normal Functions Starts */

/* API Functions Starts */
const response = (res, code, message, other) => {
  const hasErr = other?.hasError || !successCode.has(code);
  const responseType = other?.type || "json";

  const msg = message || defaultResponseMessage[code];

  return res
    .status(code)
    [responseType]({ hasError: hasErr, message: msg, status: code, ...other });
};
const allowedMethods = (req, res, methods = ["GET"]) => {
  if (!methods.includes(req.method)) {
    send(res, 405, `${req.method} is not allowed.`);
    return true;
  }

  return false;
};
/* API Functions Ends */

/* Encryption Functions Starts */
const encrypt = (value, SECRET_KEY) => {
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
const decrypt = (hash, SECRET_KEY) => {
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
const encryptSHA256 = (value) => {
  try {
    if (!value) {
      return null;
    }
    return CryptoJS.SHA256(value).toString();
  } catch (error) {
    console.error("Encyption/Decrption Error: ", error.message);
  }
};
const jwtSign = (value, JWT_SECRET) => {
  try {
    return jwt.sign(value, JWT_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT error:", error.message);
  }
};
const jwtVerify = (value, JWT_SECRET) => {
  try {
    return jwt.verify(value, JWT_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT error:", error.message);
  }
};
/* Encryption Functions Ends */

/* Exporting Functions */
module.exports = {
  // Normal Function Export
  getDeviceType,
  getError,
  errObj,
  handleState,
  isURL,
  getImageType,
  isBase64,
  getCommonItems,
  binarySearch,
  isDate,
  formatCurrency,
  formatNumber,
  formatDate,
  validateInputs,

  //API Functions Export
  response,
  allowedMethods,

  // Encryption Functions Export
  encrypt,
  decrypt,
  encryptSHA256,
  jwtSign,
  jwtVerify,
};
