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

const EventsPage = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [registering, setRegistering] = useState({}); // eventId: loading
  const [registeredEvents, setRegisteredEvents] = useState([]); // eventIds user registered for
  const [open, setOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Fetch events and registrations from backend
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:8080/events', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {}
    };
    fetchEvents();
    // Fetch registered events for current user
    const fetchRegistered = async () => {
      try {
        const res = await fetch('http://localhost:8080/events/registered', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setRegisteredEvents(data.map(e => e.eventId || e));
        }
      } catch (err) {}
    };
    fetchRegistered();
  }, []);
  // Register for event
  const handleRegister = async (eventId) => {
    setRegistering((prev) => ({ ...prev, [eventId]: true }));
    try {
      const res = await fetch(`http://localhost:8080/events/${eventId}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setRegisteredEvents((prev) => [...prev, eventId]);
      }
    } catch (err) {}
    setRegistering((prev) => ({ ...prev, [eventId]: false }));
  };

  // Unregister from event
  const handleUnregister = async (eventId) => {
    setRegistering((prev) => ({ ...prev, [eventId]: true }));
    try {
      const res = await fetch(`http://localhost:8080/events/${eventId}/register`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setRegisteredEvents((prev) => prev.filter(id => id !== eventId));
      }
    } catch (err) {}
    setRegistering((prev) => ({ ...prev, [eventId]: false }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDate('');
  setLocation('');
  setDescription('');
  setEndDate('');
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

  const [eventFormError, setEventFormError] = useState('');
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventFormError('');
    // Validate required fields
    const requiredFields = [
      { key: 'title', value: title },
      { key: 'date', value: date },
      { key: 'endDate', value: endDate },
      { key: 'location', value: location },
      { key: 'description', value: description }
    ];
    const missingFields = requiredFields.filter(f => !f.value || (typeof f.value === 'string' && f.value.trim() === '')).map(f => f.key);
    if (missingFields.length > 0) {
      setEventFormError('Missing required fields: ' + missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', '));
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, date, endDate, location, description, tags }),
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prev) => [...prev, newEvent]);
        handleClose();
      } else {
        const errorData = await res.json();
        if (errorData.missingFields) {
          setEventFormError('Missing required fields: ' + errorData.missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', '));
        } else {
          setEventFormError(errorData.message || 'Error creating event');
        }
      }
    } catch (err) {
      setEventFormError('Error creating event');
    }
  };

  // Students, alumni, and admin can create events
  const canCreateEvent = user?.role === 'student' || user?.role === 'alumni' || user?.role === 'admin';

  return (
    <PageContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Upcoming Events</Typography>
        {canCreateEvent && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Create Event
          </Button>
        )}
      </Stack>

      {events.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
          <Typography variant="h6">There are no upcoming events.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {events.map(event => {
            const eventId = event._id || event.id;
            const isRegistered = registeredEvents.includes(eventId);
            const isLoading = !!registering[eventId];
            return (
              <Box key={eventId} sx={{ flex: '1 1 350px', minWidth: 320, maxWidth: 420 }}>
                <EventCard
                  event={event}
                  user={user}
                  isRegistered={isRegistered}
                  isLoading={isLoading}
                  onRegister={() => handleRegister(eventId)}
                  onUnregister={() => handleUnregister(eventId)}
                />
              </Box>
            );
          })}
        </Box>
      )}

      {/* ✅ Create Event Modal */}
      {canCreateEvent && (
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
              {eventFormError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>{eventFormError}</Typography>
              )}
              <TextField
                label="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="End Date For Registration"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
      )}
    </PageContainer>
  );
};

export default EventsPage;
