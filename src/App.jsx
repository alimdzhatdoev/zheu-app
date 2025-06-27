import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import InstallButton from './InstallButton/InstallButton';
import HomePage from './pages/HomePage';
import RequestsPage from './pages/RequestsPage';
import BuildingsPage from './pages/BuildingsPage';
import PaymentsPage from './pages/PaymentsPage';
import MessagesPage from './pages/MessagesPage';

import LoginPage from './pages/LoginPage';
import ClientHomePage from './pages/ClientHomePage';
import ClientPaymentsPage from './pages/ClientPaymentsPage';
import ClientMessagesPage from './pages/ClientMessagesPage';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Админская часть */}
          <Route path="/" element={<PrivateRoute allowedRoles={['admin']}><HomePage /></PrivateRoute>} />
          <Route path="/requests" element={<PrivateRoute allowedRoles={['admin']}><RequestsPage /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute allowedRoles={['admin']}><PaymentsPage /></PrivateRoute>} />
          <Route path="/buildings" element={<PrivateRoute allowedRoles={['admin']}><BuildingsPage /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute allowedRoles={['admin']}><MessagesPage /></PrivateRoute>} />

          {/* Клиентская часть */}
          <Route path="/client" element={<PrivateRoute allowedRoles={['client']}><ClientHomePage /></PrivateRoute>} />
          <Route path="/client/payments" element={<PrivateRoute allowedRoles={['client']}><ClientPaymentsPage /></PrivateRoute>} />
          <Route path="/client/messages" element={<PrivateRoute allowedRoles={['client']}><ClientMessagesPage /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      {/* PWA кнопка */}
      <InstallButton />
      {/* </Container> */}
    </>
  );
}

export default App;
