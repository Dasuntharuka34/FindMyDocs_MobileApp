export const excuseApprovalStages = [
  { name: "Submitted", approverRole: null },
  { name: "Pending Lecturer Approval", approverRole: "Lecturer" },
  { name: "Pending HOD Approval", approverRole: "HOD" },
  { name: "Pending Dean Approval", approverRole: "Dean" },
  { name: "Pending VC Approval", approverRole: "VC" },
  { name: "Approved", approverRole: null }
];

// NOTE: These are placeholders and should be confirmed from backend logic
export const leaveApprovalStages = [
  { name: "Submitted", approverRole: null },
  { name: "Pending Lecturer Approval", approverRole: "Lecturer" },
  { name: "Pending HOD Approval", approverRole: "HOD" },
  { name: "Pending Dean Approval", approverRole: "Dean" },
  { name: "Approved", approverRole: null }
];

export const letterApprovalStages = [
  { name: "Submitted", approverRole: null },
  { name: "Pending Staff Approval", approverRole: "Staff" },
  { name: "Ready to Collect", approverRole: null },
];

export const getStagesForRequestType = (type) => {
  switch (type) {
    case 'excuse':
      return excuseApprovalStages;
    case 'leave':
      return leaveApprovalStages;
    case 'letter':
      return letterApprovalStages;
    default:
      return [];
  }
};
