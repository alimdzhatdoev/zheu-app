import axios from 'axios';

const API_URL = 'https://zheu-app-back.onrender.com/buildings';

export const fetchBuildings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addBuilding = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateBuilding = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteBuilding = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
