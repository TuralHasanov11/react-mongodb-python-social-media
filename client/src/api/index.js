import axios from 'axios'

const url = ''

export const getPosts = () => axios.get(url)
export const createPost = (newPost) => axios.post(url, newPost);
export const likePost = (id) => axios.patch(`${url}/${id}/like`);
export const updatePost = (id, updatedPost) => axios.put(`${url}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${url}/${id}`);