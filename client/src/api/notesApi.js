import axios from "axios";

const api  = axios.create({
    baseURL: 'http://localhost:8000/',
});

export const getNotes = () => api.get('/notes');
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (note) => api.post('/notes', note);
export const updateNote = (id, note) => api.put(`/notes/${id}`, note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const getUsers = () => api.get('/users');
