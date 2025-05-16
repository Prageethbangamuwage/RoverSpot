import axios from 'axios';

const createApi = (baseURL: string) => {
  const api = axios.create({ baseURL });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

const authApi = createApi(import.meta.env.VITE_AUTH_SERVICE_URL);
const blogApi = createApi(import.meta.env.VITE_BLOG_SERVICE_URL);
const userApi = createApi(import.meta.env.VITE_USER_SERVICE_URL);

export const auth = {
  login: (email: string, password: string) => 
    authApi.post('/api/auth/login', { email, password }),
  signup: (userData: any) => 
    authApi.post('/api/auth/signup', userData),
  verify: () => 
    authApi.get('/api/auth/verify')
};

export const blog = {
  create: (blogData: any) => 
    blogApi.post('/api/blogs', blogData),
  getAll: (category?: string) => 
    blogApi.get('/api/blogs', { params: { category } }),
  getById: (id: string) => 
    blogApi.get(`/api/blogs/${id}`),
  update: (id: string, blogData: any) => 
    blogApi.put(`/api/blogs/${id}`, blogData),
  delete: (id: string) => 
    blogApi.delete(`/api/blogs/${id}`)
};

export const user = {
  getProfile: () => 
    userApi.get('/api/profiles/me'),
  updateProfile: (profileData: any) => 
    userApi.put('/api/profiles/me', profileData),
  deleteProfile: () => 
    userApi.delete('/api/profiles/me')
};