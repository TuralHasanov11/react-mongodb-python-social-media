import axios from 'axios'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' });

axiosInstance.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});


export const getPost = (id) => axiosInstance.get(`/posts/${id}`);
export const getPosts = (page) => axiosInstance.get(`/posts?page=${page}`);
export const getPostsBySearch = (searchQuery) => axiosInstance.get(`/posts/search`, { params: { searchQuery: searchQuery.search, tags: searchQuery.tags } });
export const createPost = (newPost) => axiosInstance.post('/posts', newPost);
export const likePost = (id) => axiosInstance.patch(`/posts/${id}/like`);
export const comment = (value, id) => axiosInstance.post(`/posts/${id}/comments`, { comment:value });
export const updatePost = (id, updatedPost) => axiosInstance.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => axiosInstance.delete(`/posts/${id}`);

export const login = (formData) => axiosInstance.post('/auth/login', formData);
export const register = (formData) => axiosInstance.post('/auth/register', formData);