// Email validation helper
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

// Password requirements: min 8 characters, at least 1 letter, at least 1 number
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      hasMinLength: false,
      hasLetter: false,
      hasNumber: false,
    };
  }

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    isValid: hasMinLength && hasLetter && hasNumber,
    hasMinLength,
    hasLetter,
    hasNumber,
  };
}

