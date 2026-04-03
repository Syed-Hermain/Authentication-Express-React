import axios from "axios";

export const api  = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true
});

export const getNotes = () => api.get('/notes');
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (note) => api.post('/notes', note);
export const updateNote = (id, note) => api.put(`/notes/${id}`, note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const getUsers = () => api.get('/users');
export const checkAuth = () => api.get('/users/check');
export const signup = (user) => api.post('/users/signup', user);
export const login = (user) => api.post('/users/login', user);
export const logout = () => api.post('/users/logout');