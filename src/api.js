import axios from "axios";

// get env vars from vite app
const API_URL = '/todos';

const readTodos = async () => {
  let res = await axios.get(API_URL);
  return res.data;
}

const createTodo = async (name) => {
  let res = await axios.post(API_URL, { 'name': name });
  return res.data;
}

const doneTodo = async (id) => {
  let res = await axios.put(`${API_URL}/${id}/done`);
  return res.data;
}

const undoneTodo = async (id) => {
  let res = await axios.delete(`${API_URL}/${id}/done`);
  return res.data;
}

export {
  readTodos,
  createTodo,
  doneTodo,
  undoneTodo
}
