import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import RequestModal from './RequestModal';
import {
  fetchRequests,
  addRequest,
  updateRequest
} from '../api/requests';
import { fetchBuildings } from '../api/buildings';

const statusFlow = ['новая', 'в работе', 'выполнена'];

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [requestData, buildingData] = await Promise.all([
        fetchRequests(),
        fetchBuildings()
      ]);
      setRequests(requestData);
      setBuildings(buildingData);
    };
    loadData();
  }, []);

  const handleAdd = async (newRequest) => {
    const saved = await addRequest({
      ...newRequest,
      createdAt: new Date().toISOString()
    });
    setRequests((prev) => [...prev, saved]);
  };

  const handleUpdate = async (updatedData) => {
    const updated = await updateRequest(editingRequest.id, updatedData);
    setRequests((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setEditingRequest(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    const target = requests.find(r => r.id === id);
    const updated = await updateRequest(id, { ...target, status: newStatus });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? updated : r))
    );
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Удалить заявку?');
    if (!confirm) return;
    await fetch(`https://zheu-app-back.onrender.com/requests/${id}`, {
      method: 'DELETE'
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Box px={4} py={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Заявки</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setModalOpen(true)}
        >
          Добавить заявку
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Тип</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Здание</TableCell>
              <TableCell>Квартира</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.address}</TableCell>
                <TableCell>{r.apartment}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell>
                  <Select
                    value={r.status}
                    size="small"
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  >
                    {statusFlow.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => setEditingRequest(r)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(r.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        buildings={buildings}
      />

      <RequestModal
        open={!!editingRequest}
        onClose={() => setEditingRequest(null)}
        onSubmit={handleUpdate}
        initialData={editingRequest}
        buildings={buildings}
      />
    </Box>
  );
};

export default RequestList;
