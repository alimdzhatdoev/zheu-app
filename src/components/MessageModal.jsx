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

const MessageModal = ({ open, onClose, onSubmit, initialData = null, buildings = [] }) => {
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
      reset({ name: '', address: '', apartment: '', message: '', status: 'новое' });
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
      <DialogTitle>{initialData ? 'Редактировать обращение' : 'Новое обращение'}</DialogTitle>
      <DialogContent>
        <form id="message-form" onSubmit={handleSubmit(handleFormSubmit)}>
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
            name="message"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Сообщение"
                margin="normal"
                fullWidth
                multiline
                rows={4}
                required
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" form="message-form" variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageModal;
