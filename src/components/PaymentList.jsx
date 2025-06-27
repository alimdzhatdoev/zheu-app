import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import PaymentModal from './PaymentModal';
import {
  fetchPayments,
  addPayment,
  updatePayment,
  deletePayment
} from '../api/payments';
import { fetchBuildings } from '../api/buildings';

const statusOptions = ['оплачен', 'ожидает'];

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [paymentData, buildingData] = await Promise.all([
        fetchPayments(),
        fetchBuildings()
      ]);
      setPayments(paymentData);
      setBuildings(buildingData);
    };
    loadData();
  }, []);

  const handleAdd = async (payment) => {
    const saved = await addPayment(payment);
    setPayments((prev) => [...prev, saved]);
  };

  const handleUpdate = async (updatedData) => {
    const updated = await updatePayment(editingPayment.id, updatedData);
    setPayments((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingPayment(null);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Удалить платёж?');
    if (!confirm) return;
    await deletePayment(id);
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    const payment = payments.find((p) => p.id === id);
    const updated = await updatePayment(id, { ...payment, status: newStatus });
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
  };

  return (
    <Box px={4} py={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Платежи</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setModalOpen(true)}
        >
          Добавить платёж
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ФИО</TableCell>
              <TableCell>Квартира</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.apartment}</TableCell>
                <TableCell>{p.amount} ₽</TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select
                    value={p.status}
                    size="small"
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => setEditingPayment(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        buildings={buildings}
      />

      <PaymentModal
        open={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        onSubmit={handleUpdate}
        initialData={editingPayment}
        buildings={buildings}
      />
    </Box>
  );
};

export default PaymentList;
