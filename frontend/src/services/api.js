import axios from 'axios';

const BASE_URL = 'http://localhost/employee_system/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// Helper for error handling
const handleApiError = (error) => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  return { success: false, message };
};

export const authApi = {
  login: async (credentials) => {
    try {
      const { data } = await api.post('/login.php', credentials);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  logout: async () => {
    try {
      // Assuming a logout.php exists or just clear on frontend
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export const employeeApi = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/getEmployees.php', { params });
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  add: async (employeeData) => {
    try {
      const { data } = await api.post('/addEmployee.php', employeeData);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  update: async (employeeData) => {
    try {
      const { data } = await api.post('/updateEmployee.php', employeeData);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  delete: async (emp_id) => {
    try {
      const { data } = await api.post('/deleteEmployee.php', { emp_id });
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export const leaveApi = {
  getLeaves: async (params = {}) => {
    try {
      const { data } = await api.get('/getLeaves.php', { params });
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  getBalance: async (emp_id) => {
    try {
      const { data } = await api.get('/getLeaveBalance.php', { params: { emp_id } });
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  apply: async (leaveData) => {
    try {
      const { data } = await api.post('/applyLeave.php', leaveData);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  approve: async (approveData) => {
    try {
      const { data } = await api.post('/approveLeave.php', approveData);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export const analyticsApi = {
  getStats: async (params = {}) => {
    try {
      const { data } = await api.get('/analytics.php', { params });
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export const attendanceApi = {
  mark: async (attendanceData) => {
    try {
      const { data } = await api.post('/markAttendance.php', attendanceData);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  getHistory: async (params = {}) => {
    try {
      // Ensure we always pass the current role for access control
      const { data } = await api.get('/getAttendance.php', { params });
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default api;
