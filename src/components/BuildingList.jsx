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
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import BuildingModal from './BuildingModal';
import {
  fetchBuildings,
  addBuilding,
  updateBuilding,
  deleteBuilding
} from '../api/buildings';

const BuildingList = () => {
  const [buildings, setBuildings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchBuildings();
      setBuildings(data);
    };
    loadData();
  }, []);

  const handleAdd = async (building) => {
    const saved = await addBuilding(building);
    setBuildings((prev) => [...prev, saved]);
  };

  const handleUpdate = async (updatedData) => {
    const updated = await updateBuilding(editingBuilding.id, updatedData);
    setBuildings((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
    setEditingBuilding(null);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Удалить здание?');
    if (!confirm) return;
    await deleteBuilding(id);
    setBuildings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <Box px={4} py={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Здания</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setModalOpen(true)}
        >
          Добавить здание
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Адрес</TableCell>
              <TableCell>Квартир</TableCell>
              <TableCell>Год постройки</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buildings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.address}</TableCell>
                <TableCell>{b.flats}</TableCell>
                <TableCell>{b.year}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => setEditingBuilding(b)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(b.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <BuildingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
      />

      <BuildingModal
        open={!!editingBuilding}
        onClose={() => setEditingBuilding(null)}
        onSubmit={handleUpdate}
        initialData={editingBuilding}
      />
    </Box>
  );
};

export default BuildingList;
