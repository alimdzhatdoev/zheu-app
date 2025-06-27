import React from 'react';
import { Container } from '@mui/material';
import RequestList from '../components/RequestList';
import Header from '../components/Header';

const RequestsPage = () => {
  return (
    <>
      <Header />

      <RequestList />
    </>
  );
};

export default RequestsPage;
