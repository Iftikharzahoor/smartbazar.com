import { useSelector, useDispatch } from 'react-redux';
import {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  updateProfileSuccess
} from '../features/auth/authSlice.js';
import api from '../services/api.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector(state => state.auth);

  const loginUser = async (email, password) => {
    dispatch(authStart());
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      dispatch(authSuccess({ user: userData, token }));
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      dispatch(authFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const registerUser = async (name, email, password) => {
    dispatch(authStart());
    try {
      const response = await api.post('/auth/register', { name, email, password });
      dispatch(authFailure(null)); // Reset loading state cleanly
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      dispatch(authFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const logoutUser = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error session cleanup:', err);
    } finally {
      dispatch(logoutSuccess());
    }
  };

  const checkUserSession = async () => {
    try {
      const response = await api.get('/auth/me');
      dispatch(authSuccess({ user: response.data.user }));
      return { success: true };
    } catch (err) {
      dispatch(authFailure(null));
      return { success: false };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/me/update', profileData);
      dispatch(updateProfileSuccess(response.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Profile update failed' };
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    checkUserSession,
    updateProfile
  };
};
