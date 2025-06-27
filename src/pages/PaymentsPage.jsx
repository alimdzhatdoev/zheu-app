import React from 'react';
import { Container, Typography } from '@mui/material';
import PaymentList from '../components/PaymentList';
import Header from '../components/Header';

const PaymentsPage = () => {
  return (
    <>
      <Header />

      <PaymentList />
    </>
  );
};

export default PaymentsPage;
