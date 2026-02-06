// ==================== API & APP CONFIG ====================
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://your-backend-url.com/api',
  TIMEOUT: 30000, // 30 seconds
  UPLOAD_TIMEOUT: 60000, // 60 seconds for file uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  REFRESH_TOKEN: 'refreshToken',
  THEME_PREFERENCE: 'theme',
  LANGUAGE_PREFERENCE: 'language',
  LAST_SYNC_TIME: 'lastSyncTime',
};

// ==================== USER ROLES ====================
export const USER_ROLES = {
  STUDENT: 'Student',
  LECTURER: 'Lecturer',
  HOD: 'HOD',
  DEAN: 'Dean',
  VC: 'VC',
  ADMIN: 'Admin',
  STAFF: 'Staff',
};

// Role hierarchy for approval flow
export const ROLE_HIERARCHY = {
  [USER_ROLES.STUDENT]: 0,
  [USER_ROLES.LECTURER]: 1,
  [USER_ROLES.HOD]: 2,
  [USER_ROLES.DEAN]: 3,
  [USER_ROLES.VC]: 4,
  [USER_ROLES.ADMIN]: 5,
};

// ==================== REQUEST TYPES ====================
export const REQUEST_TYPES = {
  EXCUSE: 'excuse',
  LEAVE: 'leave',
  LETTER: 'letter',
  MEDICAL: 'medical',
  OFFICIAL: 'official',
};

// ==================== REQUEST STATUS ====================
export const REQUEST_STATUS = {
  SUBMITTED: 'Submitted',
  PENDING_LECTURER_APPROVAL: 'Pending Lecturer Approval',
  PENDING_HOD_APPROVAL: 'Pending HOD Approval',
  PENDING_DEAN_APPROVAL: 'Pending Dean Approval',
  PENDING_VC_APPROVAL: 'Pending VC Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  IN_REVIEW: 'In Review',
  PROCESSING: 'Processing',
};

// Status colors for UI
export const STATUS_COLORS = {
  [REQUEST_STATUS.SUBMITTED]: '#3b82f6', // blue
  [REQUEST_STATUS.PENDING_LECTURER_APPROVAL]: '#f59e0b', // amber
  [REQUEST_STATUS.PENDING_HOD_APPROVAL]: '#f59e0b', // amber
  [REQUEST_STATUS.PENDING_DEAN_APPROVAL]: '#f59e0b', // amber
  [REQUEST_STATUS.PENDING_VC_APPROVAL]: '#f59e0b', // amber
  [REQUEST_STATUS.APPROVED]: '#10b981', // emerald
  [REQUEST_STATUS.REJECTED]: '#ef4444', // red
  [REQUEST_STATUS.IN_REVIEW]: '#8b5cf6', // violet
  [REQUEST_STATUS.PROCESSING]: '#06b6d4', // cyan
};

// Status icons for UI
export const STATUS_ICONS = {
  [REQUEST_STATUS.SUBMITTED]: 'send',
  [REQUEST_STATUS.PENDING_LECTURER_APPROVAL]: 'clock',
  [REQUEST_STATUS.PENDING_HOD_APPROVAL]: 'clock',
  [REQUEST_STATUS.PENDING_DEAN_APPROVAL]: 'clock',
  [REQUEST_STATUS.PENDING_VC_APPROVAL]: 'clock',
  [REQUEST_STATUS.APPROVED]: 'check-circle',
  [REQUEST_STATUS.REJECTED]: 'x-circle',
  [REQUEST_STATUS.IN_REVIEW]: 'search',
  [REQUEST_STATUS.PROCESSING]: 'refresh-cw',
};

// ==================== APPROVAL STAGES ====================
export const APPROVAL_STAGES = [
  { 
    name: REQUEST_STATUS.SUBMITTED, 
    approverRole: null,
    index: 0
  },
  { 
    name: REQUEST_STATUS.PENDING_LECTURER_APPROVAL, 
    approverRole: USER_ROLES.LECTURER,
    index: 1
  },
  { 
    name: REQUEST_STATUS.PENDING_HOD_APPROVAL, 
    approverRole: USER_ROLES.HOD,
    index: 2
  },
  { 
    name: REQUEST_STATUS.PENDING_DEAN_APPROVAL, 
    approverRole: USER_ROLES.DEAN,
    index: 3
  },
  { 
    name: REQUEST_STATUS.PENDING_VC_APPROVAL, 
    approverRole: USER_ROLES.VC,
    index: 4
  },
  { 
    name: REQUEST_STATUS.APPROVED, 
    approverRole: null,
    index: 5
  },
];

// Maps submitter roles to initial stage index
export const SUBMITTER_ROLE_TO_STAGE_INDEX = {
  [USER_ROLES.STUDENT]: 1,
  [USER_ROLES.LECTURER]: 2,
  [USER_ROLES.HOD]: 3,
  [USER_ROLES.DEAN]: 4,
  [USER_ROLES.VC]: 5,
};

// ==================== NOTIFICATION TYPES ====================
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  APPROVAL: 'approval',
  REJECTION: 'rejection',
  UPDATE: 'update',
};

export const NOTIFICATION_COLORS = {
  [NOTIFICATION_TYPES.INFO]: '#3b82f6', // blue
  [NOTIFICATION_TYPES.SUCCESS]: '#10b981', // green
  [NOTIFICATION_TYPES.ERROR]: '#ef4444', // red
  [NOTIFICATION_TYPES.WARNING]: '#f59e0b', // amber
  [NOTIFICATION_TYPES.APPROVAL]: '#10b981', // green
  [NOTIFICATION_TYPES.REJECTION]: '#ef4444', // red
  [NOTIFICATION_TYPES.UPDATE]: '#8b5cf6', // violet
};

// ==================== FILE UPLOAD CONSTANTS ====================
export const FILE_TYPES = {
  MEDICAL_FORM: 'medicalForm',
  LEAVE_FORM: 'leaveForm',
  ATTACHMENT: 'attachments',
  PROFILE_PICTURE: 'profilePicture',
  DOCUMENT: 'document',
};

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const FILE_EXTENSIONS = {
  JPEG: '.jpeg',
  JPG: '.jpg',
  PNG: '.png',
  PDF: '.pdf',
  DOC: '.doc',
  DOCX: '.docx',
};

// ==================== VALIDATION CONSTANTS ====================
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]{10,}$/,
  NIC_REGEX: /^([0-9]{9}[vVxX]|[0-9]{12})$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  REASON_MIN_LENGTH: 10,
  REASON_MAX_LENGTH: 500,
  ADDRESS_MAX_LENGTH: 200,
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NIC: 'Please enter a valid NIC number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name cannot exceed ${VALIDATION.NAME_MAX_LENGTH} characters`,
  REASON_TOO_SHORT: `Reason must be at least ${VALIDATION.REASON_MIN_LENGTH} characters`,
  REASON_TOO_LONG: `Reason cannot exceed ${VALIDATION.REASON_MAX_LENGTH} characters`,
  FILE_TOO_LARGE: `File size must be less than ${API_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX)',
};

// ==================== DATE & TIME CONSTANTS ====================
export const DATE_FORMATS = {
  DISPLAY_DATE: 'DD MMM YYYY',
  DISPLAY_TIME: 'hh:mm A',
  DISPLAY_DATETIME: 'DD MMM YYYY hh:mm A',
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ',
};

export const TIME_CONSTANTS = {
  MAX_LEAVE_DAYS: 30,
  MIN_LEAD_TIME_DAYS: 1, // Minimum days before leave can start
  MAX_FUTURE_DAYS: 365, // Maximum days in future for planning
};

// ==================== UI CONSTANTS ====================
export const UI = {
  MAX_RECENT_REQUESTS: 5,
  NOTIFICATIONS_LIMIT: 20,
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300, // ms for search debouncing
  AUTO_HIDE_TOAST: 4000, // ms for toast messages
  PULL_TO_REFRESH_DELAY: 1000, // ms for refresh indicator
};

// ==================== NAVIGATION ROUTES ====================
export const ROUTES = {
  // Auth routes
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main app routes
  DASHBOARD: 'Dashboard',
  REQUESTS: 'Requests',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  
  // Request routes
  NEW_REQUEST: 'NewRequest',
  REQUEST_DETAIL: 'RequestDetail',
  EXCUSE_REQUEST: 'ExcuseRequest',
  LEAVE_REQUEST: 'LeaveRequest',
  LETTER_REQUEST: 'LetterRequest',
  
  // Admin routes
  ADMIN_DASHBOARD: 'AdminDashboard',
  USER_MANAGEMENT: 'UserManagement',
  APPROVAL_QUEUE: 'ApprovalQueue',
};

// ==================== ERROR CODES ====================
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
};

// ==================== DEPARTMENT CONSTANTS ====================
export const DEPARTMENTS = {
  COMPUTER_SCIENCE: 'Computer Science',
  INFORMATION_TECHNOLOGY: 'Information Technology',
  SOFTWARE_ENGINEERING: 'Software Engineering',
  DATA_SCIENCE: 'Data Science',
  CYBER_SECURITY: 'Cyber Security',
  MATHEMATICS: 'Mathematics',
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
};

// ==================== LEVEL OF STUDY ====================
export const STUDY_LEVELS = {
  FOUNDATION: 'Foundation',
  DIPLOMA: 'Diploma',
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  PHD: 'PhD',
  CERTIFICATE: 'Certificate',
};

// ==================== SUBJECT COMBINATIONS ====================
export const SUBJECT_COMBINATIONS = {
  CS: 'Computer Science',
  IT: 'Information Technology',
  SE: 'Software Engineering',
  DS: 'Data Science',
  CS_IT: 'Computer Science & IT',
  CS_MATH: 'Computer Science & Mathematics',
  BIO_INF: 'Bioinformatics',
  AI: 'Artificial Intelligence',
};

// ==================== REASON TYPES ====================
export const REASON_TYPES = {
  ILLNESS: 'Illness',
  FAMILY_EMERGENCY: 'Family Emergency',
  PERSONAL: 'Personal Reasons',
  OFFICIAL: 'Official University Work',
  WEDDING: 'Wedding',
  RELIGIOUS: 'Religious Reasons',
  OTHER: 'Other',
};

// ==================== EXPORT ALL CONSTANTS ====================
export default {
  // Config
  API_CONFIG,
  STORAGE_KEYS,
  
  // User & Roles
  USER_ROLES,
  ROLE_HIERARCHY,
  
  // Requests
  REQUEST_TYPES,
  REQUEST_STATUS,
  STATUS_COLORS,
  STATUS_ICONS,
  APPROVAL_STAGES,
  SUBMITTER_ROLE_TO_STAGE_INDEX,
  
  // Notifications
  NOTIFICATION_TYPES,
  NOTIFICATION_COLORS,
  
  // File handling
  FILE_TYPES,
  ALLOWED_FILE_TYPES,
  FILE_EXTENSIONS,
  
  // Validation
  VALIDATION,
  ERROR_MESSAGES,
  
  // Date & Time
  DATE_FORMATS,
  TIME_CONSTANTS,
  
  // UI
  UI,
  ROUTES,
  
  // Errors
  ERROR_CODES,
  
  // Academic
  DEPARTMENTS,
  STUDY_LEVELS,
  SUBJECT_COMBINATIONS,
  REASON_TYPES,
};