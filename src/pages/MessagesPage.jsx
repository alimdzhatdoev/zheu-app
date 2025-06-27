import React from 'react';
import { Container, Typography } from '@mui/material';
import MessageList from '../components/MessageList';
import Header from '../components/Header';

const MessagesPage = () => {
  return (
    <>
      <Header />
      <MessageList />
    </>
  );
};

export default MessagesPage;
