import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const requestTypes = [
  'Сантехника',
  'Электрика',
  'Отопление',
  'Общее благоустройство'
];

const RequestModal = ({ open, onClose, onSubmit, initialData = null, buildings = [] }) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm();
  const [availableFlats, setAvailableFlats] = useState([]);

  const selectedAddress = watch('address');

  useEffect(() => {
    if (initialData) {
      reset(initialData);

      const building = buildings.find((b) => b.address === initialData.address);
      if (building) {
        const flats = Array.from({ length: building.flats }, (_, i) => `${i + 1}`);
        setAvailableFlats(flats);
      }
    } else {
      reset({ name: '', address: '', apartment: '', type: '', description: '', status: 'новая' });
    }
  }, [initialData, reset, buildings]);

  useEffect(() => {
    const building = buildings.find((b) => b.address === selectedAddress);
    if (building) {
      const flats = Array.from({ length: building.flats }, (_, i) => `${i + 1}`);
      setAvailableFlats(flats);
    } else {
      setAvailableFlats([]);
    }
  }, [selectedAddress, buildings]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? 'Редактировать заявку' : 'Новая заявка'}</DialogTitle>
      <DialogContent>
        <form id="request-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Имя" margin="normal" fullWidth required />
            )}
          />

          <Controller
            name="address"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Здание</InputLabel>
                <Select {...field} label="Здание" required>
                  {buildings.map((b) => (
                    <MenuItem key={b.id} value={b.address}>
                      {b.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="apartment"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth margin="normal" disabled={!availableFlats.length}>
                <InputLabel>Квартира</InputLabel>
                <Select {...field} label="Квартира" required>
                  {availableFlats.map((apt) => (
                    <MenuItem key={apt} value={apt}>
                      {apt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="type"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} select label="Тип заявки" margin="normal" fullWidth required>
                {requestTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Описание"
                margin="normal"
                fullWidth
                multiline
                rows={3}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" form="request-form" variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestModal;
