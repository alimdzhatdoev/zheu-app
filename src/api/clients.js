// src/api/clients.js
import axios from 'axios';

const API_URL = 'https://zheu-app-back.onrender.com/clients';

export async function fetchClients() {
  const { data } = await axios.get(API_URL);
  return data;
}

export async function addClient(client) {
  const { data } = await axios.post(API_URL, client);
  return data;
}
