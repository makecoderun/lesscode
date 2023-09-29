export const isURL = (url) => {
  try {
    const valid = new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
