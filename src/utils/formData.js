import { USER_ROLES } from './constants';

// ==================== FORM VALIDATION SCHEMAS ====================

export const validationRules = {
  required: (value) => !!value?.toString().trim() || 'This field is required',
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address';
  },
  minLength: (min) => (value) => 
    value?.length >= min || `Must be at least ${min} characters`,
  maxLength: (max) => (value) => 
    value?.length <= max || `Must be less than ${max} characters`,
  password: (value) => {
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/\d/.test(value)) return 'Password must contain a number';
    return true;
  },
  mobile: (value) => {
    const mobileRegex = /^[0-9+]{10,15}$/;
    return mobileRegex.test(value) || 'Please enter a valid mobile number';
  },
  nic: (value) => {
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    return nicRegex.test(value) || 'Please enter a valid NIC number';
  },
  date: (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) || 'Please enter a valid date';
  },
  futureDate: (value) => {
    const date = new Date(value);
    const today = new Date();
    return date >= today || 'Date must be in the future';
  },
  dateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start || 'End date must be after start date';
  },
};

// ==================== FORM DATA CREATORS ====================

// Create excuse request form data
export const createExcuseRequestData = (formData, user) => {
  const data = {
    studentId: user._id,
    studentName: user.name,
    studentRole: user.role,
    regNo: formData.regNo,
    mobile: formData.mobile,
    email: formData.email,
    address: formData.address,
    levelOfStudy: formData.levelOfStudy,
    subjectCombo: formData.subjectCombo,
    absences: JSON.stringify(formData.absences || []),
    reason: formData.reason,
    reasonDetails: formData.reasonDetails,
    lectureAbsents: formData.lectureAbsents,
  };

  // Remove empty fields
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => 
      value !== undefined && value !== null && value !== ''
    )
  );
};

// Create leave request form data
export const createLeaveRequestData = (formData, user) => {
  const data = {
    requesterId: user._id,
    requesterName: user.name,
    requesterRole: user.role,
    reason: formData.reason,
    startDate: formData.startDate,
    endDate: formData.endDate,
    reasonDetails: formData.reasonDetails,
    contactDuringLeave: formData.contactDuringLeave,
    remarks: formData.remarks,
  };

  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => 
      value !== undefined && value !== null && value !== ''
    )
  );
};

// Create letter form data
export const createLetterData = (formData, user) => {
  const data = {
    type: formData.type,
    reason: formData.reason,
    date: formData.date,
    studentId: user._id,
    student: user.name,
    submitterRole: user.role,
  };

  // Add optional fields if they exist
  const optionalFields = [
    'regNo', 'mobile', 'email', 'address', 'levelOfStudy', 
    'subjectCombo', 'reasonDetails', 'lectureAbsents'
  ];

  optionalFields.forEach(field => {
    if (formData[field]) {
      data[field] = formData[field];
    }
  });

  // Handle absences array
  if (formData.absences && formData.absences.length > 0) {
    data.absences = JSON.stringify(formData.absences);
  }

  return data;
};

// Create registration form data
export const createRegistrationData = (formData) => {
  const data = {
    name: formData.name,
    email: formData.email,
    nic: formData.nic,
    mobile: formData.mobile,
    password: formData.password,
    role: formData.role,
    department: formData.department,
  };

  // Add indexNumber only for students
  if (formData.role === USER_ROLES.STUDENT && formData.indexNumber) {
    data.indexNumber = formData.indexNumber;
  }

  return data;
};

// Create user profile update data
export const createProfileUpdateData = (formData, user) => {
  const data = {
    name: formData.name,
    email: formData.email,
    nic: formData.nic,
    mobile: formData.mobile,
    department: formData.department,
  };

  // Add indexNumber only for students
  if (user.role === USER_ROLES.STUDENT && formData.indexNumber) {
    data.indexNumber = formData.indexNumber;
  }

  return data;
};

// Create approval data
export const createApprovalData = (approverId, approverName, approverRole, comment = '') => {
  return {
    approverId,
    approverName,
    approverRole,
    comment: comment.trim(),
  };
};

// Create rejection data
export const createRejectionData = (approverId, approverName, approverRole, comment) => {
  return {
    approverId,
    approverName,
    approverRole,
    comment: comment || 'Request rejected',
  };
};

// ==================== FORM VALIDATORS ====================

// Excuse request validation
export const validateExcuseRequest = (formData) => {
  const errors = {};

  if (!validationRules.required(formData.regNo)) {
    errors.regNo = validationRules.required(formData.regNo);
  }

  if (!validationRules.required(formData.reason)) {
    errors.reason = validationRules.required(formData.reason);
  }

  if (formData.absences && formData.absences.length === 0) {
    errors.absences = 'At least one absence period is required';
  }

  if (formData.email && !validationRules.email(formData.email)) {
    errors.email = validationRules.email(formData.email);
  }

  if (formData.mobile && !validationRules.mobile(formData.mobile)) {
    errors.mobile = validationRules.mobile(formData.mobile);
  }

  return errors;
};

// Leave request validation
export const validateLeaveRequest = (formData) => {
  const errors = {};

  if (!validationRules.required(formData.reason)) {
    errors.reason = validationRules.required(formData.reason);
  }

  if (!validationRules.required(formData.startDate)) {
    errors.startDate = validationRules.required(formData.startDate);
  } else if (!validationRules.date(formData.startDate)) {
    errors.startDate = validationRules.date(formData.startDate);
  }

  if (!validationRules.required(formData.endDate)) {
    errors.endDate = validationRules.required(formData.endDate);
  } else if (!validationRules.date(formData.endDate)) {
    errors.endDate = validationRules.date(formData.endDate);
  }

  if (formData.startDate && formData.endDate) {
    const dateRangeError = validationRules.dateRange(formData.startDate, formData.endDate);
    if (dateRangeError !== true) {
      errors.endDate = dateRangeError;
    }
  }

  return errors;
};

// Letter validation
export const validateLetter = (formData) => {
  const errors = {};

  if (!validationRules.required(formData.type)) {
    errors.type = validationRules.required(formData.type);
  }

  if (!validationRules.required(formData.reason)) {
    errors.reason = validationRules.required(formData.reason);
  }

  if (!validationRules.required(formData.date)) {
    errors.date = validationRules.required(formData.date);
  } else if (!validationRules.date(formData.date)) {
    errors.date = validationRules.date(formData.date);
  }

  return errors;
};

// Registration validation
export const validateRegistration = (formData) => {
  const errors = {};

  if (!validationRules.required(formData.name)) {
    errors.name = validationRules.required(formData.name);
  }

  if (!validationRules.required(formData.email)) {
    errors.email = validationRules.required(formData.email);
  } else if (!validationRules.email(formData.email)) {
    errors.email = validationRules.email(formData.email);
  }

  if (!validationRules.required(formData.nic)) {
    errors.nic = validationRules.required(formData.nic);
  } else if (!validationRules.nic(formData.nic)) {
    errors.nic = validationRules.nic(formData.nic);
  }

  if (!validationRules.required(formData.mobile)) {
    errors.mobile = validationRules.required(formData.mobile);
  } else if (!validationRules.mobile(formData.mobile)) {
    errors.mobile = validationRules.mobile(formData.mobile);
  }

  if (!validationRules.required(formData.password)) {
    errors.password = validationRules.required(formData.password);
  } else {
    const passwordError = validationRules.password(formData.password);
    if (passwordError !== true) {
      errors.password = passwordError;
    }
  }

  if (!validationRules.required(formData.confirmPassword)) {
    errors.confirmPassword = validationRules.required(formData.confirmPassword);
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!validationRules.required(formData.role)) {
    errors.role = validationRules.required(formData.role);
  }

  if (formData.role === USER_ROLES.STUDENT && !validationRules.required(formData.indexNumber)) {
    errors.indexNumber = validationRules.required(formData.indexNumber);
  }

  return errors;
};

// Profile update validation
export const validateProfileUpdate = (formData) => {
  const errors = {};

  if (!validationRules.required(formData.name)) {
    errors.name = validationRules.required(formData.name);
  }

  if (!validationRules.required(formData.email)) {
    errors.email = validationRules.required(formData.email);
  } else if (!validationRules.email(formData.email)) {
    errors.email = validationRules.email(formData.email);
  }

  if (!validationRules.required(formData.nic)) {
    errors.nic = validationRules.required(formData.nic);
  } else if (!validationRules.nic(formData.nic)) {
    errors.nic = validationRules.nic(formData.nic);
  }

  if (!validationRules.required(formData.mobile)) {
    errors.mobile = validationRules.required(formData.mobile);
  } else if (!validationRules.mobile(formData.mobile)) {
    errors.mobile = validationRules.mobile(formData.mobile);
  }

  return errors;
};

// ==================== FORM INITIAL VALUES ====================

export const initialExcuseRequest = {
  regNo: '',
  mobile: '',
  email: '',
  address: '',
  levelOfStudy: '',
  subjectCombo: '',
  absences: [],
  reason: '',
  reasonDetails: '',
  lectureAbsents: '',
};

export const initialLeaveRequest = {
  reason: '',
  startDate: '',
  endDate: '',
  reasonDetails: '',
  contactDuringLeave: '',
  remarks: '',
};

export const initialLetter = {
  type: '',
  reason: '',
  date: '',
  regNo: '',
  mobile: '',
  email: '',
  address: '',
  levelOfStudy: '',
  subjectCombo: '',
  absences: [],
  reasonDetails: '',
  lectureAbsents: '',
};

export const initialRegistration = {
  name: '',
  email: '',
  nic: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  role: USER_ROLES.STUDENT,
  department: '',
  indexNumber: '',
};

export const initialProfileUpdate = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  nic: user?.nic || '',
  mobile: user?.mobile || '',
  department: user?.department || '',
  indexNumber: user?.indexNumber || '',
});

// ==================== UTILITY FUNCTIONS ====================

// Format form data for API submission
export const formatFormData = (formData, type, user) => {
  switch (type) {
    case 'excuse':
      return createExcuseRequestData(formData, user);
    case 'leave':
      return createLeaveRequestData(formData, user);
    case 'letter':
      return createLetterData(formData, user);
    case 'registration':
      return createRegistrationData(formData);
    case 'profile':
      return createProfileUpdateData(formData, user);
    default:
      return formData;
  }
};

// Validate form based on type
export const validateForm = (formData, type) => {
  switch (type) {
    case 'excuse':
      return validateExcuseRequest(formData);
    case 'leave':
      return validateLeaveRequest(formData);
    case 'letter':
      return validateLetter(formData);
    case 'registration':
      return validateRegistration(formData);
    case 'profile':
      return validateProfileUpdate(formData);
    default:
      return {};
  }
};

// Check if form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

// Get initial values for form type
export const getInitialValues = (type, user = null) => {
  switch (type) {
    case 'excuse':
      return initialExcuseRequest;
    case 'leave':
      return initialLeaveRequest;
    case 'letter':
      return initialLetter;
    case 'registration':
      return initialRegistration;
    case 'profile':
      return initialProfileUpdate(user);
    default:
      return {};
  }
};

// Create absence period object
export const createAbsencePeriod = (courseCode = '', date = '') => {
  return { courseCode, date };
};

// Add absence period to form data
export const addAbsencePeriod = (formData, absence) => {
  const absences = [...(formData.absences || []), absence];
  return { ...formData, absences };
};

// Remove absence period from form data
export const removeAbsencePeriod = (formData, index) => {
  const absences = formData.absences.filter((_, i) => i !== index);
  return { ...formData, absences };
};

// Helper to create form data with file for upload
export const createFormDataWithFile = (formData, fileUri, fieldName) => {
  const data = new FormData();
  
  // Add all form fields
  Object.keys(formData).forEach(key => {
    if (formData[key] !== undefined && formData[key] !== null) {
      data.append(key, formData[key]);
    }
  });

  // Add file if provided
  if (fileUri) {
    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    data.append(fieldName, {
      uri: fileUri,
      name: filename,
      type,
    });
  }

  return data;
};

export default {
  // Form data creators
  createExcuseRequestData,
  createLeaveRequestData,
  createLetterData,
  createRegistrationData,
  createProfileUpdateData,
  createApprovalData,
  createRejectionData,

  // Validators
  validateExcuseRequest,
  validateLeaveRequest,
  validateLetter,
  validateRegistration,
  validateProfileUpdate,
  validationRules,

  // Initial values
  initialExcuseRequest,
  initialLeaveRequest,
  initialLetter,
  initialRegistration,
  initialProfileUpdate,

  // Utilities
  formatFormData,
  validateForm,
  hasErrors,
  getInitialValues,
  createAbsencePeriod,
  addAbsencePeriod,
  removeAbsencePeriod,
  createFormDataWithFile,
};