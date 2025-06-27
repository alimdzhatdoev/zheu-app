// src/pages/ClientPaymentsPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { fetchClientPayments } from '../api/clientPayments';
import Header from '../components/Header';

const ClientPaymentsPage = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState(null);  // null = ещё загружается
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;  // ждём, пока user подтянется

    (async () => {
      try {
        const data = await fetchClientPayments(user.address, user.apartment);
        setPayments(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить платежи');
        setPayments([]);
      }
    })();
  }, [user]);

  // Пока нет user или данные ещё загружаются
  if (!user || payments === null) {
    return (
      <Box px={4} py={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />

      <Box px={4} py={3}>
        <Typography variant="h5" gutterBottom>
          Мои платежи
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Сумма</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length ? payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.amount} ₽</TableCell>
                  <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                  <TableCell>{p.status}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Нет платежей
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
};

export default ClientPaymentsPage;
