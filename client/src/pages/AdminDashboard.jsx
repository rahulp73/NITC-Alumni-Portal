import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Grid,
  Chip
} from '@mui/material';
import PageContainer from '../components/home/components/PageContainer';

const fetchPending = async (endpoint) => {
  const res = await fetch(endpoint, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [events, jobs] = await Promise.all([
          fetchPending('http://localhost:8080/events?pending=1'),
          fetchPending('http://localhost:8080/jobs?pending=1'),
        ]);
        setPendingEvents(events.filter(e => e.status === 'pending'));
        setPendingJobs(jobs.filter(j => j.status === 'pending'));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (type, id) => {
    setVerifying(v => ({ ...v, [`${type}-delete-${id}`]: true }));
    try {
      const url = `http://localhost:8080/${type}/${id}`;
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Failed to delete: ' + (err.message || res.status));
        return;
      }
      // Refetch pending lists
      try {
        const [events, jobs] = await Promise.all([
          fetchPending('http://localhost:8080/events?pending=1'),
          fetchPending('http://localhost:8080/jobs?pending=1'),
        ]);
        setPendingEvents(events.filter(e => e.status === 'pending'));
        setPendingJobs(jobs.filter(j => j.status === 'pending'));
      } catch {}
    } catch (e) {
      alert('Network or server error deleting.');
    } finally {
      setVerifying(v => ({ ...v, [`${type}-delete-${id}`]: false }));
    }
  };

  const handleVerify = async (type, id) => {
    console.log("Verifying", type, id);
    setVerifying(v => ({ ...v, [`${type}-${id}`]: true }));
    try {
      const url = `http://localhost:8080/${type}/${id}/verify`;
      const res = await fetch(url, { method: 'PATCH', credentials: 'include' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Failed to verify: ' + (err.message || res.status));
        return;
      }
      // Optionally, refetch the pending lists to ensure UI matches DB
      try {
        const [events, jobs] = await Promise.all([
          fetchPending('http://localhost:8080/events?pending=1'),
          fetchPending('http://localhost:8080/jobs?pending=1'),
        ]);
        console.log("Refetched pending events and jobs after verification.");
        setPendingEvents(events.filter(e => e.status === 'pending'));
        setPendingJobs(jobs.filter(j => j.status === 'pending'));
      } catch {}
    } catch (e) {
      alert('Network or server error verifying.');
    } finally {
      setVerifying(v => ({ ...v, [`${type}-${id}`]: false }));
      console.log("Verification process completed for", type, id);
    }
  };

  return (
    <PageContainer>
      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Pending Events" />
          <Tab label="Pending Jobs" />
        </Tabs>
      </Paper>
      {loading ? (
        <CircularProgress />
      ) : (
        tab === 0 ? (
          <Grid container spacing={2}>
            {pendingEvents.length === 0 ? (
              <Typography sx={{ m: 2 }}>No pending events.</Typography>
            ) : pendingEvents.map(event => (
              <Grid item xs={12} md={6} key={event._id || event.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{event.location} | {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{event.description}</Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    {event.tags?.map(tag => <Chip key={tag} label={tag} size="small" />)}
                  </Stack>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={verifying[`events-${event._id || event.id}`]}
                    onClick={() => handleVerify('events', event._id || event.id)}
                    sx={{ mr: 1 }}
                  >
                    {verifying[`events-${event._id || event.id}`] ? 'Verifying...' : 'Verify'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={verifying[`events-delete-${event._id || event.id}`]}
                    onClick={() => handleDelete('events', event._id || event.id)}
                  >
                    {verifying[`events-delete-${event._id || event.id}`] ? 'Deleting...' : 'Reject'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {pendingJobs.length === 0 ? (
              <Typography sx={{ m: 2 }}>No pending jobs.</Typography>
            ) : pendingJobs.map(job => (
              <Grid item xs={12} md={6} key={job._id || job.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{job.company} | {job.location}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{job.description}</Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    {job.tags?.map(tag => <Chip key={tag} label={tag} size="small" />)}
                  </Stack>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={verifying[`jobs-${job._id || job.id}`]}
                    onClick={() => handleVerify('jobs', job._id || job.id)}
                    sx={{ mr: 1 }}
                  >
                    {verifying[`jobs-${job._id || job.id}`] ? 'Verifying...' : 'Verify'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={verifying[`jobs-delete-${job._id || job.id}`]}
                    onClick={() => handleDelete('jobs', job._id || job.id)}
                  >
                    {verifying[`jobs-delete-${job._id || job.id}`] ? 'Deleting...' : 'Reject'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </PageContainer>
  );
}
