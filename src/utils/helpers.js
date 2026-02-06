import { Platform } from 'react-native';

// ==================== DATE & TIME HELPERS ====================

/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
};

// ==================== STRING HELPERS ====================

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Format file size to readable string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// ==================== VALIDATION HELPERS ====================

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Sri Lankan phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(?:\+94|0)(?:(?:11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(?:\d{7})|(?:70|71|72|74|75|76|77|78)(?:\d{7})|(?:2\d{8}))$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Validate Sri Lankan NIC (old and new format)
 */
export const isValidNIC = (nic) => {
  // Old format: 9 digits + V or X (e.g., 123456789V)
  // New format: 12 digits (e.g., 200012345678)
  const oldFormat = /^[0-9]{9}[VXvx]$/;
  const newFormat = /^[0-9]{12}$/;
  
  return oldFormat.test(nic) || newFormat.test(nic);
};

/**
 * Validate required field
 */
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength;
};

// ==================== ARRAY & OBJECT HELPERS ====================

/**
 * Remove duplicates from array
 */
export const removeDuplicates = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Sort array by key
 */
export const sortByKey = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) return ascending ? -1 : 1;
    if (valueA > valueB) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Deep clone object or array
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

// ==================== FILE & MEDIA HELPERS ====================

/**
 * Get file extension from filename or URL
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  
  // Handle both URLs and regular filenames
  const baseName = filename.split('/').pop();
  return baseName.includes('.') ? baseName.split('.').pop().toLowerCase() : '';
};

/**
 * Check if file is an image
 */
export const isImageFile = (filename) => {
  const extension = getFileExtension(filename);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  return imageExtensions.includes(extension);
};

/**
 * Check if file is a document
 */
export const isDocumentFile = (filename) => {
  const extension = getFileExtension(filename);
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  return documentExtensions.includes(extension);
};

/**
 * Get file type category
 */
export const getFileType = (filename) => {
  if (isImageFile(filename)) return 'image';
  if (isDocumentFile(filename)) return 'document';
  
  const extension = getFileExtension(filename);
  if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
  
  return 'other';
};

// ==================== UI & PLATFORM HELPERS ====================

/**
 * Check if running on iOS
 */
export const isIOS = () => {
  return Platform.OS === 'ios';
};

/**
 * Check if running on Android
 */
export const isAndroid = () => {
  return Platform.OS === 'android';
};

/**
 * Get platform-specific styling
 */
export const platformStyle = (iosStyle, androidStyle) => {
  return isIOS() ? iosStyle : androidStyle;
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ==================== REQUEST & STATUS HELPERS ====================

/**
 * Get status color based on request status
 */
export const getStatusColor = (status) => {
  const statusColors = {
    'Submitted': '#3b82f6',        // Blue
    'Pending Lecturer Approval': '#f59e0b', // Amber
    'Pending HOD Approval': '#f59e0b',     // Amber
    'Pending Dean Approval': '#f59e0b',    // Amber
    'Pending VC Approval': '#f59e0b',      // Amber
    'Approved': '#10b981',         // Green
    'Rejected': '#ef4444',         // Red
    'In Review': '#8b5cf6',        // Purple
  };
  
  return statusColors[status] || '#6b7280'; // Gray for unknown status
};

/**
 * Get status icon name based on request status
 */
export const getStatusIcon = (status) => {
  const statusIcons = {
    'Submitted': 'clock',
    'Pending Lecturer Approval': 'clock-alert',
    'Pending HOD Approval': 'clock-alert',
    'Pending Dean Approval': 'clock-alert',
    'Pending VC Approval': 'clock-alert',
    'Approved': 'check-circle',
    'Rejected': 'close-circle',
    'In Review': 'alert-circle',
  };
  
  return statusIcons[status] || 'help-circle';
};

/**
 * Format approval stage for display
 */
export const formatApprovalStage = (stageIndex) => {
  const stages = [
    'Submitted',
    'Pending Lecturer Approval',
    'Pending HOD Approval',
    'Pending Dean Approval',
    'Pending VC Approval',
    'Approved'
  ];
  
  return stages[stageIndex] || 'Unknown Stage';
};

/**
 * Calculate progress percentage for approval stages
 */
export const getApprovalProgress = (currentStageIndex, totalStages = 5) => {
  return Math.min(100, Math.max(0, (currentStageIndex / totalStages) * 100));
};

// ==================== EXPORT ALL HELPERS ====================

export default {
  // Date & Time
  formatDate,
  formatDateTime,
  getRelativeTime,
  isToday,
  isYesterday,
  
  // String
  capitalizeWords,
  truncateText,
  formatFileSize,
  getInitials,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isValidNIC,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  
  // Array & Object
  removeDuplicates,
  sortByKey,
  groupBy,
  deepClone,
  
  // File & Media
  getFileExtension,
  isImageFile,
  isDocumentFile,
  getFileType,
  
  // UI & Platform
  isIOS,
  isAndroid,
  platformStyle,
  debounce,
  generateId,
  
  // Request & Status
  getStatusColor,
  getStatusIcon,
  formatApprovalStage,
  getApprovalProgress
};