import axios from 'axios';

const API_URL = 'https://zheu-app-back.onrender.com/requests';

export const fetchRequests = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addRequest = async (data) => {
  const newRequest = {
    ...data,
    status: 'новая',
    createdAt: new Date().toISOString()
  };
  const response = await axios.post(API_URL, newRequest);
  return response.data;
};

export const updateRequest = async (id, updatedData) => {
  const response = await axios.put(`https://zheu-app-back.onrender.com/requests/${id}`, updatedData);
  return response.data;
};
