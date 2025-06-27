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

const statusOptions = ['оплачен', 'ожидает'];

const PaymentModal = ({ open, onClose, onSubmit, initialData = null, buildings = [] }) => {
  const { control, handleSubmit, reset, watch } = useForm();
  const [availableFlats, setAvailableFlats] = useState([]);

  const selectedAddress = watch('address');

  useEffect(() => {
    if (initialData) {
      reset(initialData);

      // Установка доступных квартир при редактировании
      const building = buildings.find((b) => b.address === initialData.address);
      if (building) {
        const flats = Array.from({ length: building.flats }, (_, i) => `${i + 1}`);
        setAvailableFlats(flats);
      }
    } else {
      reset({ name: '', address: '', apartment: '', amount: '', date: '', status: 'ожидает' });
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
    const parsed = {
      ...data,
      amount: Number(data.amount)
    };
    onSubmit(parsed);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? 'Редактировать платёж' : 'Новый платёж'}</DialogTitle>
      <DialogContent>
        <form id="payment-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="ФИО" margin="normal" fullWidth required />
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
            name="amount"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Сумма (₽)"
                type="number"
                margin="normal"
                fullWidth
                required
              />
            )}
          />

          <Controller
            name="date"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Дата платежа"
                type="date"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            defaultValue="ожидает"
            render={({ field }) => (
              <TextField {...field} select label="Статус" margin="normal" fullWidth>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" form="payment-form" variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
