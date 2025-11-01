import React from 'react';
import { Box, Typography } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography align="center" color="text.secondary">
        This is a placeholder for the admin dashboard. More features coming soon!
      </Typography>
    </Box>
  );
}
