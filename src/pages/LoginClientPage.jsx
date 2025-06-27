import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchClients } from '../api/clients';
import { AuthContext } from '../contexts/AuthContext';

const LoginClientPage = () => {
  const [clients, setClients] = useState([]);
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await fetchClients();
      setClients(data);
    })();
  }, []);

  const addresses = Array.from(new Set(clients.map(c => c.address)));
  const apartments = address
    ? Array.from(new Set(clients.filter(c => c.address === address).map(c => c.apartment)))
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const clientData = clients.find(c =>
      c.address === address &&
      c.apartment === apartment &&
      c.name === name &&
      c.password === password
    );
    if (clientData) {
      login(clientData);
      navigate('/client');
    } else {
      alert('Неверные данные');
    }
  };

  return (
    <Box px={4} py={3}>
      <Typography variant="h5" gutterBottom>Вход для жителей</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Здание</InputLabel>
          <Select
            value={address}
            label="Здание"
            onChange={e => setAddress(e.target.value)}
            required
          >
            {addresses.map(addr => (
              <MenuItem key={addr} value={addr}>{addr}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Квартира</InputLabel>
          <Select
            value={apartment}
            label="Квартира"
            onChange={e => setApartment(e.target.value)}
            required
          >
            {apartments.map(apt => (
              <MenuItem key={apt} value={apt}>{apt}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Имя"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Войти
        </Button>
      </Box>
    </Box>
  );
};

export default LoginClientPage;
