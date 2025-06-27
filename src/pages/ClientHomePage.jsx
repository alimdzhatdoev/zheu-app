// src/pages/ClientHomePage.jsx
import React, { useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';

const ClientHomePage = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null; // на всякий случай

  return (
    <>
      <Header />

      <Box px={4} py={3}>
        <Typography variant="h5" gutterBottom>
          Добро пожаловать, {user.name}
        </Typography>
        <Typography>
          Ваш адрес: {user.address}, кв. {user.apartment}
        </Typography>
        <Box mt={2}>
          <Button component={Link} to="/client/payments" variant="contained" sx={{ mr: 2 }}>
            Мои платежи
          </Button>
          <Button component={Link} to="/client/messages" variant="contained">
            Мои обращения
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ClientHomePage;
