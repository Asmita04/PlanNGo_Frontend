import apiClient from './client';
import { API_ENDPOINTS } from '../../constants';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  signup: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.SIGNUP, userData);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  googleLogin: async (googleUser) => {
    const response = await apiClient.post(API_ENDPOINTS.GOOGLE_LOGIN, {
      googleUser,
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};