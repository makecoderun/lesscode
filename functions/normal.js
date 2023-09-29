import { base64Regex, urlRegex } from "@/regex";
import { toast } from "react-toastify";

export const isURL = (url, useRegex) => {
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
export const getImageType = async (imageData) => {
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
export const isBase64 = (item) => {
  return base64Regex.test(item);
};
export const getCommonItems = (selected, available) => {
  // Create a Set from available for faster lookup
  const availableSet = new Set(available);

  // Use filter and Set.has for efficient intersection
  const commonFiles = selected.filter((file) => availableSet.has(file));

  return commonFiles;
};
export const binarySearch = (sortedArr, target) => {
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
export const isDate = (value) => {
  console.log(value instanceof Date, !isNaN(value));
  return value instanceof Date && !isNaN(value);
};
export const formatCurrency = (amount, currency, options) => {
  const formatter = new Intl.NumberFormat(options?.locales || "en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: options?.minimumFractionDigits || 2,
  });
  return formatter.format(amount);
};
export const formatNumber = (num) => {
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
export const formatDate = (dateString) => {
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

// Device Function
export const getDeviceType = () => {
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
export const getError = (error) => {
  for (let err in error) {
    if (handleToast(error[err]) || error[err].hasError) return true;

    if (error[err] && typeof error[err] === "object") {
      const hasNestedError = getError(error[err]);
      if (hasNestedError) {
        return true;
      }
    }
  }

  return false;
};
export const errObj = (errorCondition, message) => {
  return {
    hasError: Boolean(errorCondition),
    message: !errorCondition ? "" : message,
  };
};
export const handleState = (setState, value, name, subField) => {
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
export const handleToast = (resp, errMessage, showOnlyOnError = true) => {
  const getStatus = (hasError) => {
    if (hasError === null) return "info";
    if (hasError === undefined) return "warn";
    if (hasError === true) return "error";
    if (hasError === false) return "success";
  };

  const hasErr = errMessage ? true : resp?.hasError;
  const shouldShowToast = showOnlyOnError ? Boolean(hasErr) : true;

  shouldShowToast && toast[getStatus(hasErr)](errMessage || resp?.message);

  return Boolean(hasErr);
};
