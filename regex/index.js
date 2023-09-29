const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9._]{3,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&]*.{8,}$/;
const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const base64Regex = /^data:[a-zA-Z0-9/]+;base64,([A-Za-z0-9+/=]+\n*)+$/;

export { emailRegex, usernameRegex, passwordRegex, urlRegex, base64Regex };
