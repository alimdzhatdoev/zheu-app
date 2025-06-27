import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { fetchClients, addClient } from '../api/clients';
import { fetchBuildings } from '../api/buildings';

const ADMIN_PASSWORD = 'admin123';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');       // 'login' или 'register'
  const [role, setRole] = useState('client');      // 'admin' или 'client'
  const [clients, setClients] = useState([]);      // уже зарегистрированные жители
  const [buildings, setBuildings] = useState([]);  // список домов из JSON

  const [formData, setFormData] = useState({
    address: '',
    apartment: '',
    name: '',
    password: ''
  });

  // Подгружаем и клиентов, и здания
  useEffect(() => {
    (async () => {
      try {
        const [cls, blds] = await Promise.all([
          fetchClients(),
          fetchBuildings()
        ]);
        setClients(cls);
        setBuildings(blds);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      }
    })();
  }, []);

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const switchMode = () => {
    setMode(m => (m === 'login' ? 'register' : 'login'));
    setFormData({ address: '', apartment: '', name: '', password: '' });
  };

  // Источник адресов — всегда buildings
  const addressOptions = buildings.map(b => b.address);

  // Источник квартир —
  // • при входе: только из существующих clients
  // • при регистрации: по числу flats у выбранного здания
  const apartmentOptions = formData.address
    ? mode === 'login'
      ? Array.from(new Set(
          clients
            .filter(c => c.address === formData.address)
            .map(c => c.apartment)
        ))
      : (() => {
          const b = buildings.find(b => b.address === formData.address);
          return b
            ? Array.from({ length: b.flats }, (_, i) => String(i + 1))
            : [];
        })()
    : [];

  const handleSubmit = async e => {
    e.preventDefault();

    // —— Админская часть ——
    if (role === 'admin') {
      if (formData.password === ADMIN_PASSWORD) {
        login({ role: 'admin', user: { name: 'Администратор' } });
        navigate('/', { replace: true });
      } else {
        alert('Неверный пароль администратора');
      }
      return;
    }

    // —— Клиентская часть ——
    if (mode === 'login') {
      // попытка входа
      const client = clients.find(c =>
        c.address === formData.address &&
        c.apartment === formData.apartment &&
        c.name === formData.name &&
        c.password === formData.password
      );
      if (client) {
        login({ role: 'client', user: client });
        navigate('/client', { replace: true });
      } else {
        alert('Пользователь не найден или неверный пароль');
      }
    } else {
      // регистрация
      try {
        const newClient = {
          address: formData.address,
          apartment: formData.apartment,
          name: formData.name,
          password: formData.password
        };
        const created = await addClient(newClient);
        setClients(prev => [...prev, created]);  // чтобы сразу залогинить
        login({ role: 'client', user: created });
        navigate('/client', { replace: true });
      } catch (err) {
        console.error('Ошибка регистрации', err);
        alert('Не удалось зарегистрироваться. Попробуйте снова.');
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100dvh">
      <Box width="400px">
        <Typography variant="h5" gutterBottom textAlign="center">
          {mode === 'login' ? 'Вход' : 'Регистрация'} как {role === 'admin' ? 'Админ' : 'Житель'}
        </Typography>

        <RadioGroup
          row
          value={role}
          onChange={e => setRole(e.target.value)}
          sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
        >
          <FormControlLabel value="client" control={<Radio />} label="Житель" />
          <FormControlLabel value="admin" control={<Radio />} label="Админ" />
        </RadioGroup>

        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
          {role === 'client' && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Адрес</InputLabel>
                <Select
                  name="address"
                  value={formData.address}
                  label="Адрес"
                  required
                  onChange={handleChange}
                >
                  {addressOptions.map(addr => (
                    <MenuItem key={addr} value={addr}>
                      {addr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" disabled={!formData.address}>
                <InputLabel>Квартира</InputLabel>
                <Select
                  name="apartment"
                  value={formData.apartment}
                  label="Квартира"
                  required
                  onChange={handleChange}
                >
                  {apartmentOptions.map(apt => (
                    <MenuItem key={apt} value={apt}>
                      {apt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Имя"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Пароль"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          {role === 'client' && (
            <Box mt={1} textAlign="center">
              <MuiLink
                component="button"
                variant="body2"
                onClick={switchMode}
              >
                {mode === 'login'
                  ? 'Нет аккаунта? Зарегистрироваться'
                  : 'Уже есть аккаунт? Войти'}
              </MuiLink>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
