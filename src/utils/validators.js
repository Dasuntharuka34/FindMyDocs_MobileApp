// Validation patterns
const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]{10,}$/,
  NIC_OLD: /^[0-9]{9}[vVxX]$/, // Old NIC format: 123456789V
  NIC_NEW: /^[0-9]{12}$/, // New NIC format: 200012345678
  INDEX_NUMBER: /^[A-Za-z0-9]{6,10}$/,
  COURSE_CODE: /^[A-Za-z]{2,4}[0-9]{3,4}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[A-Za-z\s.'-]{2,50}$/,
  ADDRESS: /^[A-Za-z0-9\s,.'-]{5,100}$/,
};

// Error messages
const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  NIC: 'Please enter a valid NIC number',
  INDEX_NUMBER: 'Please enter a valid index number',
  COURSE_CODE: 'Please enter a valid course code (e.g., CS101)',
  DATE: 'Please enter a valid date (YYYY-MM-DD)',
  PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  NAME: 'Please enter a valid name (2-50 characters)',
  ADDRESS: 'Please enter a valid address',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Cannot exceed ${max} characters`,
  MIN_VALUE: (min) => `Must be at least ${min}`,
  MAX_VALUE: (max) => `Cannot exceed ${max}`,
  FILE_TYPE: (types) => `File must be one of: ${types.join(', ')}`,
  FILE_SIZE: (maxSizeMB) => `File size must be less than ${maxSizeMB}MB`,
};

// Generic validators
export const required = (value) => {
  if (value === null || value === undefined || value === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  return null;
};

export const email = (value) => {
  if (value && !PATTERNS.EMAIL.test(value)) {
    return ERROR_MESSAGES.EMAIL;
  }
  return null;
};

export const phone = (value) => {
  if (value && !PATTERNS.PHONE.test(value.replace(/[\s-()]/g, ''))) {
    return ERROR_MESSAGES.PHONE;
  }
  return null;
};

export const nic = (value) => {
  if (value && !PATTERNS.NIC_OLD.test(value) && !PATTERNS.NIC_NEW.test(value)) {
    return ERROR_MESSAGES.NIC;
  }
  return null;
};

export const indexNumber = (value) => {
  if (value && !PATTERNS.INDEX_NUMBER.test(value)) {
    return ERROR_MESSAGES.INDEX_NUMBER;
  }
  return null;
};

export const courseCode = (value) => {
  if (value && !PATTERNS.COURSE_CODE.test(value)) {
    return ERROR_MESSAGES.COURSE_CODE;
  }
  return null;
};

export const date = (value) => {
  if (value && !PATTERNS.DATE.test(value)) {
    return ERROR_MESSAGES.DATE;
  }
  return null;
};

export const password = (value) => {
  if (value && !PATTERNS.PASSWORD.test(value)) {
    return ERROR_MESSAGES.PASSWORD;
  }
  return null;
};

export const name = (value) => {
  if (value && !PATTERNS.NAME.test(value)) {
    return ERROR_MESSAGES.NAME;
  }
  return null;
};

export const address = (value) => {
  if (value && !PATTERNS.ADDRESS.test(value)) {
    return ERROR_MESSAGES.ADDRESS;
  }
  return null;
};

// Length validators
export const minLength = (min) => (value) => {
  if (value && value.length < min) {
    return ERROR_MESSAGES.MIN_LENGTH(min);
  }
  return null;
};

export const maxLength = (max) => (value) => {
  if (value && value.length > max) {
    return ERROR_MESSAGES.MAX_LENGTH(max);
  }
  return null;
};

// Number validators
export const minValue = (min) => (value) => {
  const num = Number(value);
  if (value && !isNaN(num) && num < min) {
    return ERROR_MESSAGES.MIN_VALUE(min);
  }
  return null;
};

export const maxValue = (max) => (value) => {
  const num = Number(value);
  if (value && !isNaN(num) && num > max) {
    return ERROR_MESSAGES.MAX_VALUE(max);
  }
  return null;
};

// File validators
export const fileType = (allowedTypes) => (file) => {
  if (file && !allowedTypes.includes(file.type)) {
    return ERROR_MESSAGES.FILE_TYPE(allowedTypes);
  }
  return null;
};

export const fileSize = (maxSizeMB) => (file) => {
  if (file && file.size > maxSizeMB * 1024 * 1024) {
    return ERROR_MESSAGES.FILE_SIZE(maxSizeMB);
  }
  return null;
};

// Date validators
export const futureDate = (value) => {
  if (value && new Date(value) <= new Date()) {
    return 'Date must be in the future';
  }
  return null;
};

export const pastDate = (value) => {
  if (value && new Date(value) >= new Date()) {
    return 'Date must be in the past';
  }
  return null;
};

export const dateRange = (minDate, maxDate) => (value) => {
  if (value) {
    const date = new Date(value);
    if (minDate && date < new Date(minDate)) {
      return `Date must be after ${minDate}`;
    }
    if (maxDate && date > new Date(maxDate)) {
      return `Date must be before ${maxDate}`;
    }
  }
  return null;
};

// Custom validators for your specific forms
export const validateAbsenceDate = (value) => {
  const errors = [];
  
  const requiredError = required(value);
  if (requiredError) errors.push(requiredError);
  
  const dateError = date(value);
  if (dateError) errors.push(dateError);
  
  const pastError = pastDate(value);
  if (pastError) errors.push(pastError);
  
  return errors.length > 0 ? errors : null;
};

export const validateStartEndDate = (startDate, endDate) => {
  const errors = {};
  
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.endDate = 'End date must be after start date';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Form-specific validation schemas
export const LOGIN_SCHEMA = {
  email: [required, email],
  password: [required, minLength(6)],
};

export const REGISTRATION_SCHEMA = {
  name: [required, name, minLength(2), maxLength(50)],
  email: [required, email],
  nic: [required, nic],
  mobile: [required, phone],
  password: [required, password],
  role: [required],
  department: [required],
  indexNumber: (value, allValues) => {
    if (allValues.role === 'Student') {
      return [required, indexNumber];
    }
    return [];
  },
};

export const EXCUSE_REQUEST_SCHEMA = {
  reason: [required, minLength(10), maxLength(500)],
  regNo: [required, indexNumber],
  mobile: [required, phone],
  email: [required, email],
  absences: {
    courseCode: [required, courseCode],
    date: [validateAbsenceDate],
  },
};

export const LEAVE_REQUEST_SCHEMA = {
  reason: [required, minLength(10), maxLength(500)],
  startDate: [required, date, futureDate],
  endDate: [required, date, futureDate],
  contactDuringLeave: [required, phone],
};

export const LETTER_SCHEMA = {
  type: [required],
  reason: [required, minLength(10), maxLength(500)],
  date: [required, date],
};

// Composite validator function
export const validateField = (value, validators) => {
  if (!validators || validators.length === 0) return null;
  
  for (const validator of validators) {
    const error = typeof validator === 'function' ? validator(value) : null;
    if (error) return error;
  }
  
  return null;
};

export const validateForm = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const fieldValidators = typeof schema[field] === 'function' 
      ? schema[field](value, data) 
      : schema[field];
    
    if (Array.isArray(fieldValidators)) {
      const error = validateField(value, fieldValidators);
      if (error) errors[field] = error;
    } else if (typeof fieldValidators === 'object' && value) {
      // Handle nested objects (like absences array)
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const itemErrors = validateForm(item, fieldValidators);
          if (Object.keys(itemErrors).length > 0) {
            errors[field] = errors[field] || [];
            errors[field][index] = itemErrors;
          }
        });
      }
    }
  });
  
  // Additional cross-field validation
  if (data.startDate && data.endDate) {
    const dateErrors = validateStartEndDate(data.startDate, data.endDate);
    if (dateErrors) {
      Object.assign(errors, dateErrors);
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Utility functions
export const isValidEmail = (email) => !email || PATTERNS.EMAIL.test(email);
export const isValidPhone = (phone) => !phone || PATTERNS.PHONE.test(phone.replace(/[\s-()]/g, ''));
export const isValidNIC = (nic) => !nic || PATTERNS.NIC_OLD.test(nic) || PATTERNS.NIC_NEW.test(nic);
export const isValidDate = (date) => !date || PATTERNS.DATE.test(date);

// Validation helpers for real-time validation
export const createValidator = (validators) => (value) => validateField(value, validators);

// Common validation chains
export const requiredEmail = [required, email];
export const requiredPhone = [required, phone];
export const requiredName = [required, name];
export const requiredPassword = [required, password];
export const requiredDate = [required, date];

// Export patterns and messages for external use
export { PATTERNS, ERROR_MESSAGES };

// Default export with all validators
export default {
  // Basic validators
  required,
  email,
  phone,
  nic,
  indexNumber,
  courseCode,
  date,
  password,
  name,
  address,
  
  // Length validators
  minLength,
  maxLength,
  
  // Number validators
  minValue,
  maxValue,
  
  // File validators
  fileType,
  fileSize,
  
  // Date validators
  futureDate,
  pastDate,
  dateRange,
  
  // Custom validators
  validateAbsenceDate,
  validateStartEndDate,
  
  // Validation schemas
  LOGIN_SCHEMA,
  REGISTRATION_SCHEMA,
  EXCUSE_REQUEST_SCHEMA,
  LEAVE_REQUEST_SCHEMA,
  LETTER_SCHEMA,
  
  // Utility functions
  validateField,
  validateForm,
  isValidEmail,
  isValidPhone,
  isValidNIC,
  isValidDate,
  createValidator,
  
  // Common chains
  requiredEmail,
  requiredPhone,
  requiredName,
  requiredPassword,
  requiredDate,
  
  // Constants
  PATTERNS,
  ERROR_MESSAGES
};