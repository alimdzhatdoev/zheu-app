import React, { useEffect, useState } from 'react';
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
import ReplyIcon from '@mui/icons-material/Reply';

import MessageModal from './MessageModal';
import ReplyModal from './ReplyModal';
import {
  fetchMessages,
  addMessage,
  updateMessage,
  deleteMessage
} from '../api/messages';
import { fetchBuildings } from '../api/buildings';

const statusOptions = ['новое', 'прочитано', 'решено'];

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [msgData, buildingData] = await Promise.all([
        fetchMessages(),
        fetchBuildings()
      ]);
      setMessages(msgData);
      setBuildings(buildingData);
    };
    loadData();
  }, []);

  const handleAdd = async (message) => {
    const saved = await addMessage({
      ...message,
      createdAt: new Date().toISOString(),
      reply: ''
    });
    setMessages((prev) => [...prev, saved]);
  };

  const handleUpdate = async (updatedData) => {
    const updated = await updateMessage(editingMessage.id, updatedData);
    setMessages((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
    setEditingMessage(null);
  };

  const handleReply = async (id, replyText) => {
    const target = messages.find((m) => m.id === id);
    const updated = await updateMessage(id, { ...target, reply: replyText });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? updated : m))
    );
    setReplyingTo(null);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Удалить обращение?');
    if (!confirm) return;
    await deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    const target = messages.find((m) => m.id === id);
    const updated = await updateMessage(id, { ...target, status: newStatus });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? updated : m))
    );
  };

  return (
    <Box px={4} py={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Обращения</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setModalOpen(true)}
        >
          Добавить обращение
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Здание</TableCell>
              <TableCell>Квартира</TableCell>
              <TableCell>Сообщение</TableCell>
              <TableCell>Ответ</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.address}</TableCell>
                <TableCell>{m.apartment}</TableCell>
                <TableCell>{m.message}</TableCell>
                <TableCell>
                  {m.reply ? (
                    <Typography variant="body2">{m.reply}</Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">нет ответа</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={m.status}
                    size="small"
                    onChange={(e) => handleStatusChange(m.id, e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{new Date(m.createdAt).toLocaleString()}</TableCell>
                <TableCell align="center" width={'180px'}>
                  <IconButton onClick={() => setEditingMessage(m)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setReplyingTo(m)}>
                    <ReplyIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(m.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <MessageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        buildings={buildings}
      />

      <MessageModal
        open={!!editingMessage}
        onClose={() => setEditingMessage(null)}
        onSubmit={handleUpdate}
        initialData={editingMessage}
        buildings={buildings}
      />

      <ReplyModal
        open={!!replyingTo}
        onClose={() => setReplyingTo(null)}
        onSubmit={(text) => handleReply(replyingTo.id, text)}
        initialReply={replyingTo?.reply || ''}
      />
    </Box>
  );
};

export default MessageList;
