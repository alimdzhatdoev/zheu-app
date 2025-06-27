import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const BuildingModal = ({ open, onClose, onSubmit, initialData = null }) => {
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ address: '', flats: '', year: '' });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const parsed = {
      ...data,
      flats: Number(data.flats),
      year: Number(data.year)
    };
    onSubmit(parsed);
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? 'Редактировать здание' : 'Новое здание'}</DialogTitle>
      <DialogContent>
        <form id="building-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Введите адрес' }}
            render={({ field }) => (
              <TextField {...field} label="Адрес" margin="normal" fullWidth required />
            )}
          />
          <Controller
            name="flats"
            control={control}
            defaultValue=""
            rules={{ required: 'Введите количество квартир' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Количество квартир"
                margin="normal"
                fullWidth
                type="number"
                required
              />
            )}
          />
          <Controller
            name="year"
            control={control}
            defaultValue=""
            rules={{ required: 'Введите год постройки' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Год постройки"
                margin="normal"
                fullWidth
                type="number"
                required
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" form="building-form" variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuildingModal;
