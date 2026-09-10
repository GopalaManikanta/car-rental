export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateMobile = (mobile) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(String(mobile));
};

export const validateLicense = (license) => {
  // Accepts standard alphanumeric driver license formats (e.g. DL1420110012345 or ABC-1234567)
  return String(license).trim().length >= 6;
};

export const validatePassword = (password) => {
  return String(password).length >= 6;
};
