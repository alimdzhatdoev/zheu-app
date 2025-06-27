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

const ReplyModal = ({ open, onClose, onSubmit, initialReply }) => {
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset({ reply: initialReply || '' });
  }, [initialReply, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data.reply);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Ответ на обращение</DialogTitle>
      <DialogContent>
        <form id="reply-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="reply"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Ответ"
                margin="normal"
                fullWidth
                multiline
                rows={4}
                autoFocus
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" form="reply-form" variant="contained">
          Отправить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplyModal;
