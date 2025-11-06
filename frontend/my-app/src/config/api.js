export const API_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  volunteers: `${API_URL}/api/volunteers`,
  donations: `${API_URL}/api/donations`,
  gallery: `${API_URL}/api/gallery/posts`,
  blogPost: (id) => `${API_URL}/api/gallery/posts/${id}`,
  createPayment: `${API_URL}/api/create-payment-intent`,
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};