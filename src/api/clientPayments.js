import axios from 'axios';

export const fetchClientPayments = async (address, apartment) => {
  const { data } = await axios.get(
    `https://zheu-app-back.onrender.com/payments?address=${encodeURIComponent(address)}&apartment=${apartment}`
  );
  return data;
};
