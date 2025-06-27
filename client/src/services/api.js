// MOCK API IMPLEMENTATION FOR DEMO
const api = {
  get: async () => ({ data: {} }),
  post: async () => ({ data: {} }),
  put: async () => ({ data: {} }),
  delete: async () => ({ data: {} }),
};

// Auth API
export const authAPI = {
  login: async () => ({ data: { token: 'mock-token', user: { _id: 'mock-user-id', name: 'Demo User', email: 'demo@example.com', credits: 999, subscription: 'pro' } } }),
  register: async () => ({ data: { token: 'mock-token', user: { _id: 'mock-user-id', name: 'Demo User', email: 'demo@example.com', credits: 999, subscription: 'pro' } } }),
  getProfile: async () => ({ data: { user: { _id: 'mock-user-id', name: 'Demo User', email: 'demo@example.com', credits: 999, subscription: 'pro' } } }),
  updateProfile: async () => ({ data: { user: { _id: 'mock-user-id', name: 'Demo User', email: 'demo@example.com', credits: 999, subscription: 'pro' } } }),
  changePassword: async () => ({ data: {} }),
  refreshToken: async () => ({ data: { token: 'mock-token', user: { _id: 'mock-user-id', name: 'Demo User', email: 'demo@example.com', credits: 999, subscription: 'pro' } } }),
};

// Books API
export const booksAPI = {
  getBooks: async () => ({ data: { books: [] } }),
  getBook: async () => ({ data: { book: { _id: 'mock-book-id', title: 'Demo Book', author: 'Demo Author', genre: 'Fiction', files: {} } } }),
  createBook: async () => ({ data: { book: { _id: 'mock-book-id', title: 'Demo Book', author: 'Demo Author', genre: 'Fiction', files: {} } } }),
  updateBook: async () => ({ data: {} }),
  deleteBook: async () => ({ data: {} }),
  updateChapter: async () => ({ data: {} }),
  getBookStats: async () => ({ data: {} }),
  searchBooks: async () => ({ data: { books: [] } }),
  duplicateBook: async () => ({ data: {} }),
  archiveBook: async () => ({ data: {} }),
};

// Generation API
export const generationAPI = {
  generateOutline: async () => ({ data: { outline: ['Chapter 1', 'Chapter 2', 'Chapter 3'] } }),
  generateBook: async () => ({ data: { bookId: 'mock-book-id', status: 'generating', progress: 0 } }),
  generateCover: async () => ({ data: { url: 'https://via.placeholder.com/1024x1024/3B82F6/FFFFFF?text=Book+Cover' } }),
  getProgress: async () => ({ data: { progress: 100 } }),
  regenerateChapter: async () => ({ data: {} }),
};

// Download API
export const downloadAPI = {
  downloadPDF: async () => ({ data: { downloadUrl: 'https://mock-s3.amazonaws.com/books/mock-book-id/book.pdf' } }),
  downloadDOCX: async () => ({ data: { downloadUrl: 'https://mock-s3.amazonaws.com/books/mock-book-id/book.docx' } }),
  downloadEPUB: async () => ({ data: { downloadUrl: 'https://mock-s3.amazonaws.com/books/mock-book-id/book.epub' } }),
  getDownloadLinks: async () => ({ data: { pdf: 'https://mock-s3.amazonaws.com/books/mock-book-id/book.pdf', docx: 'https://mock-s3.amazonaws.com/books/mock-book-id/book.docx', epub: 'https://mock-s3.amazonaws.com/books/mock-book-id/book.epub' } }),
};

// Health check
export const healthAPI = {
  check: async () => ({ data: { status: 'ok' } }),
};

// Utility functions
export const downloadFile = (blob, filename) => {
  // No-op for demo
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