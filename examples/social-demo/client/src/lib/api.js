import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ub.bitbros.in';
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:4000/api/proxy';
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY || '';

// Debug: Log configuration
console.log('🔧 API Configuration:', {
  API_BASE_URL,
  PROXY_URL,
  PUBLIC_KEY: PUBLIC_KEY ? 'Set ✓' : 'Missing ✗'
});

// API client for read operations (direct to urBackend with public key)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': PUBLIC_KEY,
  },
});

// API client for write operations (through proxy server with secret key)
const privateApi = axios.create({
  baseURL: PROXY_URL,
});

// Add auth token interceptor
[publicApi, privateApi].forEach(api => {
  api.interceptors.request.use((config) => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
});

// Auth API
export const authApi = {
  signup: (data) => privateApi.post('/userAuth/signup', data),
  login: (data) => privateApi.post('/userAuth/login', data),
  getMe: () => privateApi.get('/userAuth/me'),
  updateProfile: (data) => privateApi.put('/userAuth/update-profile', data),
  changePassword: (data) => privateApi.put('/userAuth/change-password', data),
};

// Data API
export const dataApi = {
  // Posts
  createPost: (data) => privateApi.post('/data/posts', data),
  getPosts: (params) => privateApi.get('/data/posts', { params }),
  getPost: (id) => privateApi.get(`/data/posts/${id}`),
  updatePost: (id, data) => privateApi.put(`/data/posts/${id}`, data),
  deletePost: (id) => privateApi.delete(`/data/posts/${id}`),

  // Comments
  createComment: (data) => privateApi.post('/data/comments', data),
  getComments: (params) => privateApi.get('/data/comments', { params }),
  deleteComment: (id) => privateApi.delete(`/data/comments/${id}`),

  // Likes
  createLike: (data) => privateApi.post('/data/likes', data),
  getLikes: (params) => privateApi.get('/data/likes', { params }),
  deleteLike: (id) => privateApi.delete(`/data/likes/${id}`),

  // Follows
  createFollow: (data) => privateApi.post('/data/follows', data),
  getFollows: (params) => privateApi.get('/data/follows', { params }),
  deleteFollow: (id) => privateApi.delete(`/data/follows/${id}`),

  // Users
  getUsers: (params) => privateApi.get('/data/users', { params }),
  getUser: (id) => privateApi.get(`/data/users/${id}`),

  // Notifications
  getNotifications: (params) => privateApi.get('/data/notifications', { params }),
  updateNotification: (id, data) => privateApi.put(`/data/notifications/${id}`, data),
};

// Storage API
export const storageApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return privateApi.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (path) => privateApi.delete('/storage/file', { data: { path } }),
};

export { publicApi, privateApi };
