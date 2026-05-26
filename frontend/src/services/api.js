const API_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============ AUTH API ============
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return await response.json();
};

export const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (response.status === 401 || response.status === 403) {
      logoutUser();
      return false;
    }
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    logoutUser();
    return false;
  }
};

export const isAuthenticated = () => !!localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('userName');
};

export const getCurrentUser = () => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  role: localStorage.getItem('role'),
  name: localStorage.getItem('userName'),
});

export const setAuthData = (data) => {
  // Save main object
  localStorage.setItem(
    "eduUser",
    JSON.stringify({
      token: data.token,
      role: data.role,
      userId: data.userId,
      name: data.name
    })
  );

  // ⭐ ALSO save these for old components
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("role", data.role);
  localStorage.setItem("userName", data.name);
};

export const getDashboardPath = (role) => {
  const paths = {
    admin: '/admin-dashboard',
    institution: '/institution-dashboard',
    faculty: '/faculty-dashboard',
    student: '/student-dashboard'
  };
  return paths[role] || '/login';
};

// ============ STUDENTS API ============
export const fetchStudents = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/students?${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchStudentStats = async () => {
  const response = await fetch(`${API_URL}/students/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const createStudent = async (studentData) => {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(studentData),
  });
  return await response.json();
};

export const updateStudent = async (id, studentData) => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(studentData),
  });
  return await response.json();
};

export const deleteStudent = async (id) => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const bulkAddStudents = async (data) => {
  const response = await fetch(`${API_URL}/students/bulk-add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const bulkDeleteStudents = async (ids) => {
  const response = await fetch(`${API_URL}/students/bulk-delete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids }),
  });
  return await response.json();
};

// ============ AADHAAR API ============
export const sendAadhaarOtp = async (studentId, aadhaarNumber) => {
  const response = await fetch(`${API_URL}/students/aadhaar/send-otp`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId, aadhaarNumber }),
  });
  return await response.json();
};

// Send Aadhaar OTP for Login (2FA)
export const sendAadhaarOTP = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send OTP');
    }

    return result;
  } catch (error) {
    console.error('Send OTP error:', error);
    throw error;
  }
};

// Verify Aadhaar OTP for Login (2FA)
export const verifyAadhaarOTP = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'OTP verification failed');
    }

    return result;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// Existing Student Aadhaar OTP Verification (keep your old one)
export const verifyAadhaarOtp = async (studentId, aadhaarNumber, otp) => {
  const response = await fetch(`${API_URL}/students/aadhaar/verify-otp`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId, aadhaarNumber, otp }),
  });
  return await response.json();
};


// ============ LIFECYCLE API ============
export const fetchLifecycle = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}/lifecycle`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const addLifecycleStage = async (studentId, stageData) => {
  const response = await fetch(`${API_URL}/students/${studentId}/lifecycle`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(stageData),
  });
  return await response.json();
};

export const updateLifecycleStage = async (studentId, stageId, updateData) => {
  const response = await fetch(`${API_URL}/students/${studentId}/lifecycle/${stageId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  return await response.json();
};

export const getStudentsByStage = async (stage) => {
  const response = await fetch(`${API_URL}/students/lifecycle/stage/${stage}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const getDropoutRisk = async () => {
  const response = await fetch(`${API_URL}/students/analytics/dropout-risk`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// ============ INSTITUTIONS API ============
export const fetchInstitutions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/institutions?${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchInstitutionStats = async () => {
  const response = await fetch(`${API_URL}/institutions/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const createInstitution = async (data) => {
  const response = await fetch(`${API_URL}/institutions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const updateInstitution = async (id, data) => {
  const response = await fetch(`${API_URL}/institutions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const deleteInstitution = async (id) => {
  const response = await fetch(`${API_URL}/institutions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const bulkAddInstitutions = async (data) => {
  const response = await fetch(`${API_URL}/institutions/bulk-add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const bulkDeleteInstitutions = async (ids) => {
  const response = await fetch(`${API_URL}/institutions/bulk-delete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids }),
  });
  return await response.json();
};

// ============ TEACHERS API ============
export const fetchTeachers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/teachers?${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchTeacherStats = async () => {
  const response = await fetch(`${API_URL}/teachers/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const createTeacher = async (data) => {
  const response = await fetch(`${API_URL}/teachers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const updateTeacher = async (id, data) => {
  const response = await fetch(`${API_URL}/teachers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const deleteTeacher = async (id) => {
  const response = await fetch(`${API_URL}/teachers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const bulkAddTeachers = async (data) => {
  const response = await fetch(`${API_URL}/teachers/bulk-add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const bulkDeleteTeachers = async (ids) => {
  const response = await fetch(`${API_URL}/teachers/bulk-delete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids }),
  });
  return await response.json();
};

// ============ USERS API ============
export const fetchUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/users?${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchUserStats = async () => {
  const response = await fetch(`${API_URL}/users/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const updateUser = async (id, data) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const toggleUserStatus = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}/toggle-status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return await response.json();
};
// ============ ANALYTICS API ============
export const fetchDropoutRisk = async (institutionId) => {
  const response = await fetch(`${API_URL}/analytics/predictive/dropout-risk/${institutionId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchStudentRisk = async (studentId) => {
  const response = await fetch(`${API_URL}/analytics/predictive/student/${studentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchPerformanceForecast = async (institutionId) => {
  const response = await fetch(`${API_URL}/analytics/predictive/forecast/${institutionId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchComplianceMetrics = async (institutionId) => {
  const response = await fetch(`${API_URL}/analytics/compliance/${institutionId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchComparativeAnalysis = async () => {
  const response = await fetch(`${API_URL}/analytics/comparative`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const fetchTrendAnalysis = async (institutionId, period = '1year') => {
  const response = await fetch(`${API_URL}/analytics/trends/${institutionId}?period=${period}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};
export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await response.json();
};
// ============ ANALYTICS API ============

export const fetchStudentAnalytics = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}/analytics`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return await response.json();
};

export const fetchFacultyAnalytics = async (teacherId) => {
  const response = await fetch(`${API_URL}/teachers/${teacherId}/analytics`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return await response.json();
};

export const fetchInstitutionAnalytics = async (institutionId) => {
  const response = await fetch(`${API_URL}/institutions/${institutionId}/analytics`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return await response.json();
};

export const registerFaculty = async (data) => {
  const response = await fetch(`${API_URL}/auth/register/faculty`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
};
// ============ AI CHATBOT (GROQ) ============

export const askEduGuideAI = async (message) => {
  const response = await fetch(`${API_URL}/chat/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ message })
  });

  return await response.json();
};
// Add these to your services/api.js file

// Get all schemes
export const getSchemes = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}/schemes${queryParams ? `?${queryParams}` : ''}`, {
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// Get scheme analytics (Admin)
export const getSchemeAnalytics = async () => {
  const response = await fetch(`${API_URL}/schemes/analytics`, {
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// Get institution scheme stats
export const getInstitutionSchemeStats = async (institutionId) => {
  const response = await fetch(`${API_URL}/schemes/institution/${institutionId}/stats`, {
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// Create scheme (Admin)
export const createScheme = async (schemeData) => {
  const response = await fetch(`${API_URL}/schemes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(schemeData),
  });
  return await response.json();
};

// Update scheme (Admin)
export const updateScheme = async (schemeId, schemeData) => {
  const response = await fetch(`${API_URL}/schemes/${schemeId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(schemeData),
  });
  return await response.json();
};

// Enroll student in scheme
export const enrollStudentInScheme = async (data) => {
  const response = await fetch(`${API_URL}/schemes/enroll`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Update enrollment status
export const updateEnrollmentStatus = async (data) => {
  const response = await fetch(`${API_URL}/schemes/enrollment/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};
// Add these to services/api.js

// ============ LIFECYCLE VERIFICATION API ============

export const requestLifecycleChange = async (studentId, changeData) => {
  const response = await fetch(`${API_URL}/students/${studentId}/lifecycle/request`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(changeData),
  });
  return await response.json();
};

export const getPendingVerifications = async () => {
  const response = await fetch(`${API_URL}/students/lifecycle/pending-verifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const verifyLifecycleChange = async (verificationId, status, adminComment) => {
  const response = await fetch(`${API_URL}/students/lifecycle/verify/${verificationId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, adminComment }),
  });
  return await response.json();
};

export const getVerificationStatus = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}/lifecycle/verification-status`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};