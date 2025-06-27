import React from 'react';
import { Container, Typography } from '@mui/material';
import BuildingList from '../components/BuildingList';
import Header from '../components/Header';

const BuildingsPage = () => {
  return (
    <>
      <Header />
      <BuildingList />
    </>
  );
};

export default BuildingsPage;
