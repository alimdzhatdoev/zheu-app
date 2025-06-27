import axios from 'axios';

const API_URL = 'https://zheu-app-back.onrender.com/messages';

export const fetchMessages = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addMessage = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateMessage = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
