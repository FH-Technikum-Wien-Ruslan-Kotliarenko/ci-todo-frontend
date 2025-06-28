import axios from "axios";

axios.defaults.withCredentials = true; // <--- important (for session cookies)

const API_URL = '/api';

const readTodos = async () => {
  let res = await axios.get(`${API_URL}/todos`);
  return res.data;
}

const createTodo = async (name) => {
  let res = await axios.post(`${API_URL}/todos`, { 'name': name });
  return res.data;
}

const doneTodo = async (id) => {
  let res = await axios.put(`${API_URL}/todos/${id}/done`);
  return res.data;
}

const undoneTodo = async (id) => {
  let res = await axios.delete(`${API_URL}/todos/${id}/done`);
  return res.data;
}

const register = async (email, password) => {
  const res = await axios.post(
    `${API_URL}/auth/register`, 
    { email, password }, 
    { withCredentials: true }
  );
  return res.data;
}

const login = async (email, password) => {
  const res = await axios.post(
    `${API_URL}/auth/login`, 
    { email, password }, 
    { withCredentials: true }
  );
  return res.data;
}

const logout = async () => {
  const res = await axios.post(`${API_URL}/auth/logout`);
  return res.data;
}

const authMe = async () => {
  const res = await axios.get(`${API_URL}/auth/me`);
  return res.data;
}

export {
  readTodos,
  createTodo,
  doneTodo,
  undoneTodo,
  register,
  login,
  logout,
  authMe
}
