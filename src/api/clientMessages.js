import axios from 'axios';

export const fetchClientMessages = async (address, apartment) => {
  const { data } = await axios.get(
    `https://zheu-app-back.onrender.com/messages?address=${encodeURIComponent(address)}&apartment=${apartment}`
  );
  return data;
};
