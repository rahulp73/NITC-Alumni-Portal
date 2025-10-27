// src/components/EventCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Button, CardActions, Stack, Chip } from '@mui/material';

const EventCard = ({ event }) => {
  return (
    <Card sx={{ minWidth: 275, mb: 2, p: 1 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {event.title}
        </Typography>
        <Typography sx={{ mb: 1 }} color="text.secondary">
          {new Date(event.date).toLocaleDateString()} — {event.location}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          {event.description}
        </Typography>

        {/* ✅ Tags */}
        {event.tags && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {event.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                color={index % 2 === 0 ? 'success' : 'default'}
                size="small"
              />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions>
        <Button size="small" variant="outlined">
          Register
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
