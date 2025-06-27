// src/components/Header.jsx
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const adminLinks = [
  { label: 'Главная', to: '/' },
  { label: 'Заявки', to: '/requests' },
  { label: 'Здания', to: '/buildings' },
  { label: 'Платежи', to: '/payments' },
  { label: 'Обращения', to: '/messages' }
];

const clientLinks = [
  { label: 'Главная', to: '/client' },
  { label: 'Мои платежи', to: '/client/payments' },
  { label: 'Мои обращения', to: '/client/messages' }
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const links = role === 'admin' ? adminLinks : role === 'client' ? clientLinks : [];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#355e3b' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ЖЭУ
        </Typography>

        {links.map(({ label, to }) => (
          <Button
            key={to}
            component={NavLink}
            to={to}
            color="inherit"
            sx={{
              fontWeight: location.pathname === to ? 'bold' : 'normal',
              borderBottom: location.pathname === to ? '2px solid white' : 'none',
              borderRadius: 0,
              ml: 1
            }}
          >
            {label}
          </Button>
        ))}

        {/* Кнопка «Выйти» всегда ведёт на форму авторизации */}
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{ ml: 2, fontWeight: 'bold' }}
        >
          Выйти
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
