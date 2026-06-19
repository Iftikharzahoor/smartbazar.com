import axios from 'axios';

let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Critical for receiving and transmitting HTTP-only cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Mount Authorization Bearer Access Token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 and trigger silent Refresh Token loop
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh token logic for authentication endpoints to prevent wrong credentials
    // from triggering a token refresh failure error toast.
    const isAuthPath = originalRequest.url?.includes('/auth/login') ||
                       originalRequest.url?.includes('/auth/register') ||
                       originalRequest.url?.includes('/auth/logout') ||
                       originalRequest.url?.includes('/auth/refresh-token');

    // Retry once on 401 unauthorized checks
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { token } = refreshResponse.data;
        setAccessToken(token);

        // Update Authorization and retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken('');
        // Suppress technical 'Refresh token not found' and 'Invalid refresh token session'
        // errors by mapping them to a clean user-friendly session expiry message.
        if (refreshError.response?.data) {
          const originalError = refreshError.response.data.error;
          if (
            originalError === 'Refresh token not found' || 
            originalError === 'Invalid refresh token session'
          ) {
            refreshError.response.data.error = 'Session expired. Please sign in again.';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
