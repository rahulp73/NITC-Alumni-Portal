import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NotAuthorized() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" color="error" gutterBottom>
        Not Authorized
      </Typography>
      <Typography align="center" color="text.secondary">
        You do not have permission to view this page.
      </Typography>
    </Box>
  );
}
