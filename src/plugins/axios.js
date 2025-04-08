import axios from 'axios';

// Create a custom axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('auth-token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - token expired or invalid
        console.warn('Authentication error:', error.response.data);
        // You might want to redirect to login page or refresh token
        localStorage.removeItem('auth-token');
        // Example: router.push('/login');
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.warn('Permission denied:', error.response.data);
      } else if (status === 404) {
        // Not found
        console.warn('Resource not found:', error.response.data);
      } else if (status >= 500) {
        // Server error
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request configuration error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
