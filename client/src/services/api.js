import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response;
  },
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },
};

// Books API
export const booksAPI = {
  getBooks: async () => {
    const response = await api.get('/books');
    return response;
  },
  getBook: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response;
  },
  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response;
  },
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response;
  },
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response;
  },
  updateChapter: async (bookId, chapterId, chapterData) => {
    const response = await api.put(`/books/${bookId}/chapters/${chapterId}`, chapterData);
    return response;
  },
  getBookStats: async (id) => {
    const response = await api.get(`/books/${id}/stats`);
    return response;
  },
  searchBooks: async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    return response;
  },
  duplicateBook: async (id) => {
    const response = await api.post(`/books/${id}/duplicate`);
    return response;
  },
  archiveBook: async (id) => {
    const response = await api.put(`/books/${id}/archive`);
    return response;
  },
};

// Generation API
export const generationAPI = {
  generateOutline: async (bookData) => {
    const response = await api.post('/generation/outline', bookData);
    return response;
  },
  generateBook: async (bookData) => {
    const response = await api.post('/generation/content', bookData);
    return response;
  },
  generateCover: async (bookData) => {
    const response = await api.post('/generation/cover', bookData);
    return response;
  },
  getProgress: async (taskId) => {
    const response = await api.get(`/generation/progress/${taskId}`);
    return response;
  },
  regenerateChapter: async (bookId, chapterId) => {
    const response = await api.post(`/generation/regenerate-chapter`, { bookId, chapterId });
    return response;
  },
};

// Download API
export const downloadAPI = {
  downloadPDF: async (bookId) => {
    const response = await api.get(`/download/pdf/${bookId}`);
    return response;
  },
  downloadDOCX: async (bookId) => {
    const response = await api.get(`/download/docx/${bookId}`);
    return response;
  },
  downloadEPUB: async (bookId) => {
    const response = await api.get(`/download/epub/${bookId}`);
    return response;
  },
  getDownloadLinks: async (bookId) => {
    const response = await api.get(`/download/links/${bookId}`);
    return response;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response;
  },
};

// Utility functions
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (milliseconds) => {
  if (!milliseconds) return 'N/A';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default api; 