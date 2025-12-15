export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Zambian phone number validation
// Supports: 0978882033, +260978882033, 260978882033
export const validateZambianPhone = (phone: string): string | null => {
  if (!phone?.trim()) {
    return "Phone number is required";
  }

  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Zambian phone number patterns:
  // 1. Starting with 0: 0978882033 (10 digits)
  // 2. Starting with +260: +260978882033 (13 characters)
  // 3. Starting with 260: 260978882033 (12 digits)
  const zambianPhoneRegex = /^(\+260|260|0)[0-9]{9}$/;

  if (!zambianPhoneRegex.test(cleanPhone)) {
    return "Please enter a valid Zambian phone number (e.g., 0978882033, +260978882033, or 260978882033)";
  }

  return null;
};

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name?.trim()) {
    return "Name is required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (name.trim().length > 50) {
    return "Name must not exceed 50 characters";
  }

  return null;
};

// Password validation
export const validatePassword = (password: string, isLogin: boolean = false): string | null => {
  if (!password) {
    return "Password is required";
  }

  // For login, we don't need to check complexity
  if (isLogin) {
    return null;
  }

  // For signup, check password strength
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/(?=.*\d)/.test(password)) {
    return "Password must contain at least one number";
  }

  return null;
};

// Installation form validation
export const validateInstallationForm = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!data.customer?.trim()) {
    errors.push({ field: "customer", message: "Customer name is required" });
  }

  // Use Zambian phone validation
  const phoneError = validateZambianPhone(data.phone);
  if (phoneError) {
    errors.push({ field: "phone", message: phoneError });
  }

  if (!data.location?.trim()) {
    errors.push({ field: "location", message: "Location is required" });
  }

  // Use Zambian phone validation for reference field
  const referenceError = validateZambianPhone(data.reference);
  if (referenceError) {
    errors.push({ field: "reference", message: referenceError.replace("Phone number", "Reference phone number") });
  }

  if (!data.installedAt) {
    errors.push({ field: "installedAt", message: "Installation date is required" });
  }



  if (!data.speed || data.speed <= 0) {
    errors.push({ field: "speed", message: "Speed must be greater than 0" });
  }

  if (!data.rsrp && data.rsrp !== 0) {
    errors.push({ field: "rsrp", message: "RSRP is required" });
  }



  // Date validation
  if (data.installedAt) {
    const installDate = new Date(data.installedAt);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (installDate > today) {
      errors.push({ field: "installedAt", message: "Installation date cannot be in the future" });
    }
  }

  return errors;
};

// Login form validation
export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password, true);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Signup form validation
export const validateSignupForm = (
  name: string,
  email: string,
  phone: string,
  password: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const phoneError = validateZambianPhone(phone);
  if (phoneError) errors.phone = phoneError;

  const passwordError = validatePassword(password, false);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
