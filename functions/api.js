import { defaultResponseMessage, successCode } from "@/contants";

export const response = (res, code, message, other) => {
  const hasErr = other?.hasError || !successCode.has(code);
  const responseType = other?.type || "json";

  const msg = message || defaultResponseMessage[code];

  return res
    .status(code)
    [responseType]({ hasError: hasErr, message: msg, status: code, ...other });
};
export const allowedMethods = (req, res, methods = ["GET"]) => {
  if (!methods.includes(req.method)) {
    send(res, 405, `${req.method} is not allowed.`);
    return true;
  }

  return false;
};
