import axios from 'axios';
import { secureDelete, secureGet, secureSet } from './storage';

// Base URL - replace with your actual backend URL
const API_BASE_URL = 'https://find-my-docs-backend.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const tokenResult = await secureGet('token');
      if (tokenResult.success && tokenResult.data) {
        config.headers.Authorization = `Bearer ${tokenResult.data}`;
      }
    } catch (error) {
      console.log('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      secureDelete('token');
      secureDelete('user');
      // You might want to navigate to login here
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

export const loginUser = async (nic, password) => {
  try {
    const response = await api.post('/users/login', { nic, password });

    // Store token and user data
    if (response.data.token && response.data.user) {
      await secureSet('token', response.data.token);
      await secureSet('user', response.data.user);
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const changePassword = async (userId, passwordData) => {
  try {
    const response = await api.put(`/users/${userId}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
};

export const resetUserPassword = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

// ==================== USER ENDPOINTS ====================

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'User update failed');
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// ==================== REGISTRATION ENDPOINTS ====================

export const getPendingRegistrations = async () => {
  try {
    const response = await api.get('/users/registrations/pending');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending registrations');
  }
};

export const approveRegistration = async (registrationId) => {
  try {
    const response = await api.post(`/users/registrations/${registrationId}/approve`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to approve registration');
  }
};

export const rejectRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/users/registrations/${registrationId}/reject`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject registration');
  }
};

// ==================== EXCUSE REQUEST ENDPOINTS ====================

export const createExcuseRequest = async (requestData) => {
  try {
    // Transform and validate data before sending
    const transformedData = {
      ...requestData,
      lectureAbsents: requestData.lectureAbsents,
      absences: requestData.absences?.map(absence => ({
        courseCode: absence.courseCode,
        date: absence.date ? absence.date.replace(/\//g, '-') : absence.date
      })) || [],
      status: 'Pending Lecturer Approval',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      currentStageIndex: 0
    };

    console.log('Transformed request data:', transformedData);

    // Check if there's a file attachment
    const hasFile = requestData.medicalCertificate && requestData.medicalCertificate.uri;

    if (hasFile) {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all text fields
      Object.keys(transformedData).forEach(key => {
        if (key !== 'medicalCertificate') {
          if (key === 'absences') {
            // Handle absences array specially for FormData
            formData.append(key, JSON.stringify(transformedData[key]));
          } else {
            formData.append(key, transformedData[key]);
          }
        }
      });

      // Append file if exists
      if (requestData.medicalCertificate) {
        const file = requestData.medicalCertificate;
        const filename = file.name || file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `application/${match[1]}` : 'application/octet-stream';

        formData.append('medicalCertificate', {
          uri: file.uri,
          name: filename,
          type: type,
        });
      }

      console.log('Sending FormData request');
      const response = await api.post('/excuserequests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Send as regular JSON
      console.log('Sending JSON request');
      const response = await api.post('/excuserequests', transformedData);
      return response.data;
    }
  } catch (error) {
    console.error('Error creating excuse request:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create excuse request');
  }
};

export const getExcuseRequests = async (userId) => {
  try {
    const url = userId ? `/excuserequests/byUser/${userId}` : '/excuserequests';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch excuse requests');
  }
};

export const getExcuseRequestById = async (requestId) => {
  try {
    const response = await api.get(`/excuserequests/${requestId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch excuse request');
  }
};

export const approveExcuseRequest = async (requestId, approvalData) => {
  try {
    const response = await api.put(`/excuserequests/${requestId}/approve`, approvalData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to approve excuse request');
  }
};

export const rejectExcuseRequest = async (requestId, rejectionData) => {
  try {
    const response = await api.put(`/excuserequests/${requestId}/reject`, rejectionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject excuse request');
  }
};

export const deleteExcuseRequest = async (requestId) => {
  try {
    const response = await api.delete(`/excuserequests/${requestId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete excuse request');
  }
};

export const getPendingExcuseApprovals = async (statusName) => {
  try {
    const response = await api.get(`/excuserequests/pendingApprovals/${statusName}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending approvals');
  }
};

// New endpoint to get all excuse requests for admin
export const getAllExcuseRequests = async () => {
  try {
    const response = await api.get('/excuserequests');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all excuse requests');
  }
};

// ==================== LEAVE REQUEST ENDPOINTS ====================

export const createLeaveRequest = async (requestData) => {
  try {
    // Check if there's a file attachment
    const hasFile = requestData.supportingDocument && requestData.supportingDocument.uri;

    if (hasFile) {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all text fields
      Object.keys(requestData).forEach(key => {
        if (key !== 'supportingDocument') {
          let value = requestData[key];
          if (value instanceof Date) {
            value = value.toISOString();
          }
          formData.append(key, value);
        }
      });

      // Append file if exists
      if (requestData.supportingDocument) {
        const file = requestData.supportingDocument;
        const filename = file.name || file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `application/${match[1]}` : 'application/octet-stream';

        formData.append('leaveForm', {
          uri: file.uri,
          name: filename,
          type: type,
        });
      }

      const response = await api.post('/leaverequests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Send as regular JSON
      const response = await api.post('/leaverequests', requestData);
      return response.data;
    }
  } catch (error) {
    console.error('Error creating leave request:', error);
    throw new Error(error.response?.data?.message || 'Failed to create leave request');
  }
};

export const getLeaveRequests = async (userId) => {
  try {
    const url = userId ? `/leaverequests/byUser/${userId}` : '/leaverequests';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch leave requests');
  }
};

export const getLeaveRequestById = async (requestId) => {
  try {
    const response = await api.get(`/leaverequests/${requestId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch leave request');
  }
};

export const approveLeaveRequest = async (requestId, approvalData) => {
  try {
    const response = await api.put(`/leaverequests/${requestId}/approve`, approvalData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to approve leave request');
  }
};

export const rejectLeaveRequest = async (requestId, rejectionData) => {
  try {
    const response = await api.put(`/leaverequests/${requestId}/reject`, rejectionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject leave request');
  }
};

export const deleteLeaveRequest = async (requestId) => {
  try {
    const response = await api.delete(`/leaverequests/${requestId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete leave request');
  }
};

export const getPendingLeaveApprovals = async (status) => {
  try {
    const response = await api.get(`/leaverequests/pendingApprovals/${status}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending leave approvals');
  }
};

// ==================== LETTER ENDPOINTS ====================

export const createLetter = async (letterData) => {
  try {
    // Check if there's a file attachment
    const hasFile = letterData.supportingDocument && letterData.supportingDocument.uri;

    if (hasFile) {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all text fields
      Object.keys(letterData).forEach(key => {
        if (key !== 'supportingDocument') {
          formData.append(key, letterData[key]);
        }
      });

      // Append file if exists
      if (letterData.supportingDocument) {
        const file = letterData.supportingDocument;
        const filename = file.name || file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `application/${match[1]}` : 'application/octet-stream';

        formData.append('supportingDocument', {
          uri: file.uri,
          name: filename,
          type: type,
        });
      }

      const response = await api.post('/letters', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Send as regular JSON
      const response = await api.post('/letters', letterData);
      return response.data;
    }
  } catch (error) {
    console.error('Error creating letter:', error);
    throw new Error(error.response?.data?.message || 'Failed to create letter');
  }
};

export const getLetters = async (userId) => {
  try {
    const url = userId ? `/letters/byUser/${userId}` : '/letters';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch letters');
  }
};

export const getLetterById = async (letterId) => {
  try {
    const response = await api.get(`/letters/${letterId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch letter');
  }
};

export const updateLetterStatus = async (letterId, statusData) => {
  try {
    const response = await api.put(`/letters/${letterId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update letter status');
  }
};

export const getPendingLetterApprovals = async (statusName) => {
  try {
    const response = await api.get(`/letters/pendingApprovals/${statusName}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending letter approvals');
  }
};

// ==================== NOTIFICATION ENDPOINTS ====================

export const getNotifications = async (userId) => {
  try {
    const response = await api.get(`/notifications/byUser/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
};

export const deleteAllNotifications = async (userId) => {
  try {
    const response = await api.delete(`/notifications/byUser/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete all notifications');
  }
};

// ==================== ADMIN ENDPOINTS ====================

export const getAllPendingRequests = async () => {
  try {
    const response = await api.get('/users/pendingRequests');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all pending requests');
  }
};

export const createRegistration = async (registrationData) => {
  try {
    const response = await api.post('/registrations', registrationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create registration');
  }
};

export const deleteRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete registration');
  }
};

// ==================== FILE UPLOAD HELPERS ====================

export const uploadFile = async (fileUri, fieldName, formData, additionalData = {}) => {
  try {
    // Create FormData object if not provided
    const data = formData || new FormData();

    // Append additional data
    Object.keys(additionalData).forEach(key => {
      data.append(key, additionalData[key]);
    });

    // Append file
    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    data.append(fieldName, {
      uri: fileUri,
      name: filename,
      type,
    });

    return data;
  } catch (error) {
    throw new Error('Failed to prepare file for upload');
  }
};

// ==================== UTILITY FUNCTIONS ====================

export const setAuthToken = async (token) => {
  await secureSet('token', token);
};

export const getAuthToken = async () => {
  const result = await secureGet('token');
  return result.success ? result.data : null;
};

export const clearAuthData = async () => {
  await secureDelete('token');
  await secureDelete('user');
};

export const getStoredUser = async () => {
  const result = await secureGet('user');
  return result.success ? result.data : null;
};

// Test connection to backend
export const testConnection = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error('Cannot connect to server');
  }
};

// Test excuse request endpoint with minimal data
export const testExcuseRequestEndpoint = async () => {
  try {
    const testData = {
      regNo: 'TEST001',
      reason: 'Test reason',
      absences: [{ courseCode: 'TEST101', date: '2024-01-01' }],
      studentId: '507f1f77bcf86cd799439011',
      studentName: 'Test User',
      studentRole: 'Student'
    };

    console.log('Testing excuse request endpoint with:', testData);
    const response = await api.post('/excuserequests', testData);
    return response.data;
  } catch (error) {
    console.error('Test endpoint error:', error);
    console.error('Test endpoint response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Test failed');
  }
};

export default api;
