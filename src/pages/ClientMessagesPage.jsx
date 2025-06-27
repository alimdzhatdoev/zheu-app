import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { fetchClientMessages } from '../api/clientMessages';
import MessageModal from '../components/MessageModal';
import Header from '../components/Header';

const ClientMessagesPage = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchClientMessages(user.address, user.apartment);
      setMessages(data);
    })();
  }, [user]);

  const handleAdd = async (msg) => {
    const { addMessage } = await import('../api/messages');
    const saved = await addMessage({
      ...msg,
      address: user.address,
      apartment: user.apartment,
      status: 'новое',
      createdAt: new Date().toISOString(),
      reply: ''
    });
    setMessages((prev) => [...prev, saved]);
    setModalOpen(false);
  };

  return (
    <>
      <Header />

      <Box px={4} py={3}>
        <Typography variant="h5" gutterBottom>
          Мои обращения
        </Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Новое обращение
        </Button>

        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Сообщение</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Ответ</TableCell>
                <TableCell>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.message}</TableCell>
                  <TableCell>{m.status}</TableCell>
                  <TableCell>{m.reply || '—'}</TableCell>
                  <TableCell>{new Date(m.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <MessageModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAdd}
          buildings={[{ address: user.address, flats: 0 }]}
        />
      </Box>
    </>
  );
};

export default ClientMessagesPage;
