import axios from 'axios';

// Use environment variable for API URL, fallback to current host for development
const API_URL = import.meta.env.VITE_API_URL || (() => {
  // If we're on localhost, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  // Otherwise, use the same host/IP as the frontend
  return `http://${window.location.hostname}:3001`;
})();

export { API_URL };

export const API_ENDPOINTS = {
  login: `${API_URL}/api/admin/login`,
  logout: `${API_URL}/api/admin/logout`,
  logs: `${API_URL}/api/admin/logs`,
  logsSummary: `${API_URL}/api/admin/logs/summary`,
  volunteers: `${API_URL}/api/volunteers`,
  volunteerSignup: `${API_URL}/api/volunteer-signup`,
  volunteerApprove: (id) => `${API_URL}/api/volunteers/${id}/approve`,
  donations: `${API_URL}/api/donations`,
  donationStats: `${API_URL}/api/donations/stats`,
  donationVerify: (id) => `${API_URL}/api/donations/${id}/verify`,
  donationSendThankYou: (id) => `${API_URL}/api/donations/${id}/send-thank-you`,
  donation: `${API_URL}/api/donation`,
  gallery: `${API_URL}/api/gallery/posts`,
  blogPost: (id) => `${API_URL}/api/gallery/posts/${id}`,
  createPayment: `${API_URL}/api/create-payment-intent`,
  confirmPayment: `${API_URL}/api/confirm-payment`,
  paymentStatus: (id) => `${API_URL}/api/payment-status/${id}`,
  paymentMethods: `${API_URL}/api/payment-methods`,
  checkoutSession: (id) => `${API_URL}/api/checkout-session/${id}`,
  createPaymentSource: `${API_URL}/api/create-payment-source`,
  createPaymentMethod: `${API_URL}/api/create-payment-method`,
  sendInquiry: `${API_URL}/api/send-inquiry`,
};

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};