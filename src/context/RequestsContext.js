import React, { createContext, useState, useContext } from 'react';
import {
  getExcuseRequests,
  getLeaveRequests,
  getLetters,
  createExcuseRequest,
  createLeaveRequest,
  createLetter,
  approveExcuseRequest,
  rejectExcuseRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  updateLetterStatus,
  deleteNotification,
  getAllPendingRequests
} from '../services/api';


const RequestsContext = createContext();

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};

export const RequestsProvider = ({ children }) => {
  const [excuseRequests, setExcuseRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [letters, setLetters] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all requests for a user
  const fetchAllRequests = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [excuseData, leaveData, letterData] = await Promise.all([
        getExcuseRequests(userId),
        getLeaveRequests(userId),
        getLetters(userId)
      ]);

      setExcuseRequests(excuseData || []);
      setLeaveRequests(leaveData || []);
      setLetters(letterData || []);

    } catch (err) {
      setError(err.message || 'Failed to fetch requests');
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all requests across the system (Admin only)
  const fetchAllSystemRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [excuseData, leaveData, letterData] = await Promise.all([
        getExcuseRequests(), // No ID fetches all
        getLeaveRequests(),  // No ID fetches all
        getLetters()        // No ID fetches all
      ]);

      setExcuseRequests(excuseData || []);
      setLeaveRequests(leaveData || []);
      setLetters(letterData || []);

    } catch (err) {
      setError(err.message || 'Failed to fetch system requests');
      console.error('Error fetching system requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all pending requests for approvers
  const fetchPendingApprovals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPendingRequests();
      setPendingApprovals(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch pending approvals');
      console.error('Error fetching pending approvals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only excuse requests
  const fetchExcuseRequests = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getExcuseRequests(userId);
      setExcuseRequests(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch excuse requests');
      console.error('Error fetching excuse requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only leave requests
  const fetchLeaveRequests = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getLeaveRequests(userId);
      setLeaveRequests(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch leave requests');
      console.error('Error fetching leave requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only letters
  const fetchLetters = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getLetters(userId);
      setLetters(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch letters');
      console.error('Error fetching letters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit a new request
  const submitRequest = async (type, requestData) => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      switch (type) {
        case 'excuse':
          result = await createExcuseRequest(requestData);
          setExcuseRequests(prev => [result, ...prev]);
          break;
        case 'leave':
          result = await createLeaveRequest(requestData);
          setLeaveRequests(prev => [result, ...prev]);
          break;
        case 'letter':
          result = await createLetter(requestData);
          setLetters(prev => [result, ...prev]);
          break;
        default:
          throw new Error('Invalid request type');
      }

      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.message || `Failed to submit ${type} request`;
      setError(errorMsg);
      console.error(`Error submitting ${type} request:`, err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Approve a request
  const approveRequest = async (type, requestId, approvalData) => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      switch (type) {
        case 'excuse':
          result = await approveExcuseRequest(requestId, approvalData);
          setExcuseRequests(prev =>
            prev.map(req => req._id === requestId ? result : req)
          );
          break;
        case 'leave':
          result = await approveLeaveRequest(requestId, approvalData);
          setLeaveRequests(prev =>
            prev.map(req => req._id === requestId ? result : req)
          );
          break;
        case 'letter':
          result = await updateLetterStatus(requestId, {
            status: 'Approved',
            currentStageIndex: approvalData.currentStageIndex + 1,
            approver: approvalData.approverName,
            approverRole: approvalData.approverRole
          });
          setLetters(prev =>
            prev.map(req => req._id === requestId ? result : req)
          );
          break;
        default:
          throw new Error('Invalid request type');
      }

      // Refresh pending approvals after successful approval
      await fetchPendingApprovals();

      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.message || `Failed to approve ${type} request`;
      setError(errorMsg);
      console.error(`Error approving ${type} request:`, err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Reject a request
  const rejectRequest = async (type, requestId, rejectionData) => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      switch (type) {
        case 'excuse':
          result = await rejectExcuseRequest(requestId, rejectionData);
          setExcuseRequests(prev =>
            prev.map(req => req._id === requestId ? result : req)
          );
          break;
        case 'leave':
          result = await rejectLeaveRequest(requestId, rejectionData);
          setLeaveRequests(prev =>
            prev.map(req => req._id === requestId ? result : req)
          );
          break;
        case 'letter':
          result = await updateLetterStatus(requestId, {
            status: 'Rejected',
            rejectionReason: rejectionData.comment,
            approver: rejectionData.approverName,
            approverRole: rejectionData.approverRole
          });
          setLetters(prev =>
            prev.map(req => req._id === requestId ? result : req)
          );
          break;
        default:
          throw new Error('Invalid request type');
      }

      // Refresh pending approvals after successful rejection
      await fetchPendingApprovals();

      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.message || `Failed to reject ${type} request`;
      setError(errorMsg);
      console.error(`Error rejecting ${type} request:`, err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Get request by ID and type
  const getRequestById = (type, requestId) => {
    switch (type) {
      case 'excuse':
        return excuseRequests.find(req => req._id === requestId);
      case 'leave':
        return leaveRequests.find(req => req._id === requestId);
      case 'letter':
        return letters.find(req => req._id === requestId);
      default:
        return null;
    }
  };

  // Get all requests combined and sorted by date
  const getAllRequests = () => {
    const allRequests = [
      ...excuseRequests.map(req => ({ ...req, type: 'excuse' })),
      ...leaveRequests.map(req => ({ ...req, type: 'leave' })),
      ...letters.map(req => ({ ...req, type: 'letter' }))
    ];

    return allRequests.sort((a, b) =>
      new Date(b.submittedDate || b.createdAt) - new Date(a.submittedDate || a.createdAt)
    );
  };

  // Get pending requests count
  const getPendingCount = () => {
    const pendingExcuse = excuseRequests.filter(req =>
      req.status !== 'Approved' && req.status !== 'Rejected'
    ).length;

    const pendingLeave = leaveRequests.filter(req =>
      req.status !== 'Approved' && req.status !== 'Rejected'
    ).length;

    const pendingLetters = letters.filter(req =>
      req.status !== 'Approved' && req.status !== 'Rejected'
    ).length;

    return pendingExcuse + pendingLeave + pendingLetters;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Refresh all data
  const refreshAll = (userId) => {
    return fetchAllRequests(userId);
  };

  const value = {
    // State
    excuseRequests,
    leaveRequests,
    letters,
    pendingApprovals,
    isLoading,
    error,

    // Methods
    fetchAllRequests,
    fetchAllSystemRequests,
    fetchPendingApprovals,
    fetchExcuseRequests,
    fetchLeaveRequests,
    fetchLetters,
    submitRequest,
    approveRequest,
    rejectRequest,
    getRequestById,
    getAllRequests,
    getPendingCount,
    clearError,
    refreshAll
  };

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
};
