import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Forum as ForumIcon,
  Home as HomeIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

import { fetchRequests } from '../api/requests';
import { fetchBuildings } from '../api/buildings';
import { fetchPayments } from '../api/payments';
import { fetchMessages } from '../api/messages';
import Header from '../components/Header';

const HomePage = () => {
  const [stats, setStats] = useState({
    requests: [],
    payments: [],
    buildings: [],
    messages: []
  });

  useEffect(() => {
    const loadData = async () => {
      const [req, pay, build, msg] = await Promise.all([
        fetchRequests(),
        fetchPayments(),
        fetchBuildings(),
        fetchMessages()
      ]);
      setStats({
        requests: req,
        payments: pay,
        buildings: build,
        messages: msg
      });
    };
    loadData();
  }, []);

  const requestLineData = [
    { name: 'Новая', value: stats.requests.filter(r => r.status === 'новая').length },
    { name: 'В работе', value: stats.requests.filter(r => r.status === 'в работе').length },
    { name: 'Выполнена', value: stats.requests.filter(r => r.status === 'выполнена').length }
  ];

  const paymentLineData = [
    { name: 'Ожидает', value: stats.payments.filter(p => p.status === 'ожидает').length },
    { name: 'Оплачен', value: stats.payments.filter(p => p.status === 'оплачен').length }
  ];

  return (
    <>
      <Header />
      
      <Box px={4} py={3}>
        <Typography variant="h4" gutterBottom mb={4}>
          Добро пожаловать в систему ЖЭУ 🏡
        </Typography>

        <Grid container spacing={3} mb={3} display={'flex'} gap={'20px'} justifyContent={'space-between'} flexWrap={'nowrap'}>
          <Grid item xs={12} md={6} lg={3} width={'24%'}>
            <Card elevation={4}>
              <CardHeader
                avatar={<AssignmentIcon color="primary" />}
                title="Заявки"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography>Всего: {stats.requests.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3} width={'24%'}>
            <Card elevation={4}>
              <CardHeader
                avatar={<HomeIcon sx={{ color: '#9c27b0' }} />}
                title="Здания"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography>Всего: {stats.buildings.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3} width={'24%'}>
            <Card elevation={4}>
              <CardHeader
                avatar={<MonetizationOnIcon sx={{ color: '#4caf50' }} />}
                title="Платежи"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography>Всего: {stats.payments.length}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3} width={'24%'}>
            <Card elevation={4}>
              <CardHeader
                avatar={<ForumIcon color="secondary" />}
                title="Обращения"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography>Всего: {stats.messages.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Графики */}
        <Grid container spacing={4} display={'flex'} gap={'20px'} justifyContent={'space-between'} flexDirection={'column'}>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardHeader title="Статистика по заявкам" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={requestLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#2196f3" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={3}>
              <CardHeader title="Статистика по платежам" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={paymentLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#4caf50" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
