// src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EventCard from '../components/EventCard';
import PageContainer from '../components/home/components/PageContainer';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Mock initial data
    setEvents([
      {
        id: 1,
        title: 'Annual Alumni Reunion',
        date: '2025-12-15',
        location: 'Online',
        description: 'Join us for the annual get-together.',
        tags: ['Networking', 'Alumni', 'Virtual'],
      },
      {
        id: 2,
        title: 'Tech Talk: AI in 2025',
        date: '2025-11-20',
        location: 'CSE Seminar Hall',
        description: 'A talk by a distinguished alumnus.',
        tags: ['AI', 'Technology', 'Seminar'],
      },
    ]);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      title,
      date,
      location,
      description,
      tags,
    };
    setEvents([...events, newEvent]);
    handleClose();
  };

  return (
    <PageContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Upcoming Events</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create Event
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {events.map(event => (
          <Grid item xs={12} md={6} key={event.id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {/* ✅ Create Event Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Create Event
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />

            {/* ✅ Tag Input */}
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                size="small"
                fullWidth
              />
              <Button variant="outlined" onClick={handleAddTag}>
                Add
              </Button>
            </Stack>

            {/* ✅ Display Tags */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="success"
                  size="small"
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default EventsPage;
