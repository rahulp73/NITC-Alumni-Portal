// src/components/EventCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Button, CardActions, Stack, Chip } from '@mui/material';


const EventCard = ({ event, user, isRegistered, isLoading, onRegister, onUnregister }) => {
  // Only show action for students/alumni
  const canRegister = user?.role === 'student' || user?.role === 'alumni';
  return (
    <Card sx={{
      width: { xs: '100%', sm: 340, md: 360 },
      minWidth: 280,
      maxWidth: 400,
      flex: '1 1 320px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: 3,
      mb: 2,
    }}>
      <CardContent sx={{ flex: '1 1 auto' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
          {event.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>
          {new Date(event.date).toLocaleDateString()} • {event.location}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {event.description}
        </Typography>
        {event.tags && event.tags.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
            {event.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                color="primary"
                size="small"
                variant="filled"
              />
            ))}
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
        {canRegister && (
          <Button
            size="small"
            variant={isRegistered ? 'outlined' : 'contained'}
            color={isRegistered ? 'success' : 'primary'}
            disabled={isLoading}
            onClick={isRegistered ? onUnregister : onRegister}
          >
            {isLoading
              ? (isRegistered ? 'Unregistering...' : 'Registering...')
              : (isRegistered ? 'Unregister' : 'Register')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default EventCard;
