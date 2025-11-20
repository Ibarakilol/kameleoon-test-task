export const parseJSON = (str: any) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};
