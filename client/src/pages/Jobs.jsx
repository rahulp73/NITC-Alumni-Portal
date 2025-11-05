// src/pages/JobPostingsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActions,
  Link,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageContainer from '../components/home/components/PageContainer';
// import { getJobs, postJob } from '../services/api'; // keep for API integration later

const JobPostingsPage = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({}); // jobId: loading
  const [appliedJobs, setAppliedJobs] = useState([]); // jobIds user applied for
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    applicationLink: '',
    type: 'Full-time',
    tags: [],
    applicationDeadline: '',
  });

  useEffect(() => {
    // Fetch jobs and applied jobs from backend
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:8080/jobs', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {}
      finally {
        setLoading(false);
      }
    };
    fetchJobs();
    // Fetch jobs user has applied for
    const fetchApplied = async () => {
      try {
        const res = await fetch('http://localhost:8080/jobs/applied', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setAppliedJobs(data.map(j => j.jobId || j));
        }
      } catch (err) {}
    };
    fetchApplied();
  }, []);
  // Apply for job
  const handleApply = async (jobId) => {
    setApplying((prev) => ({ ...prev, [jobId]: true }));
    try {
      const res = await fetch(`http://localhost:8080/jobs/${jobId}/apply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setAppliedJobs((prev) => [...prev, jobId]);
      }
    } catch (err) {}
    setApplying((prev) => ({ ...prev, [jobId]: false }));
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTagInput('');
    setNewJob({
      title: '',
      company: '',
      location: '',
      description: '',
      applicationLink: '',
      type: 'Full-time',
      tags: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !newJob.tags.includes(trimmedTag)) {
      setNewJob((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
    }
    setTagInput('');
  };

  const handleDeleteTag = (tagToDelete) => {
    setNewJob((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const [jobFormError, setJobFormError] = useState('');
  const handleSubmit = async () => {
    setJobFormError('');
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'description', 'applicationLink', 'type', 'applicationDeadline'];
    const missingFields = requiredFields.filter(field => !newJob[field] || (typeof newJob[field] === 'string' && newJob[field].trim() === ''));
    if (missingFields.length > 0) {
      setJobFormError('Missing required fields: ' + missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', '));
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        const createdJob = await res.json();
        setJobs((prev) => [...prev, createdJob]);
        handleClose();
      } else {
        const errorData = await res.json();
        if (errorData.missingFields) {
          setJobFormError('Missing required fields: ' + errorData.missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', '));
        } else {
          setJobFormError(errorData.message || 'Error posting job');
        }
      }
    } catch (err) {
      setJobFormError('Error posting job');
    }
  };

  // Only alumni and admin can post jobs
  const canPostJob = user?.role === 'alumni' || user?.role === 'admin';

  return (
    <PageContainer>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Job Board
        </Typography>
        {canPostJob && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Post a Job
          </Button>
        )}
      </Box>

      {/* Job Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
          <Typography variant="h6">There are no jobs.</Typography>
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: { xs: 'center', sm: 'flex-start' },
        }}>
          {jobs.map((job) => (
            <Card
              key={job.id}
              sx={{
                width: { xs: '100%', sm: 340, md: 360 },
                minWidth: 280,
                maxWidth: 400,
                flex: '1 1 320px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 3,
                mb: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {job.company}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  📍 {job.location} • {job.type}
                </Typography>

                <Typography variant="body2" sx={{ mt: 2 }}>
                  {job.description}
                </Typography>

                {/* Tags */}
                {job.tags?.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
                    {job.tags.map((tag) => (
                      <Chip
                        key={tag}
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
                {(user?.role === 'student' || user?.role === 'alumni') && (
                  appliedJobs.includes(job._id || job.id) ? (
                    <Button size="small" variant="outlined" color="success" disabled>Applied</Button>
                  ) : (
                    job.applicationLink ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        component="a"
                        href={
                          job.applicationLink.startsWith('http://') || job.applicationLink.startsWith('https://')
                            ? job.applicationLink
                            : `https://${job.applicationLink.replace(/^(https?:\/\/)?/, '')}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        disabled={!!applying[job._id || job.id]}
                        onClick={() => handleApply(job._id || job.id)}
                      >
                        {applying[job._id || job.id] ? 'Applying...' : 'Apply'}
                      </Button>
                    )
                  )
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog for posting new job (alumni/admin only) */}
      {canPostJob && (
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Post a New Job Opportunity</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" name="title" label="Job Title" fullWidth required variant="standard" onChange={handleChange} />
            <TextField margin="dense" name="company" label="Company Name" fullWidth required variant="standard" onChange={handleChange} />
            <TextField margin="dense" name="location" label="Location (e.g., Remote, City)" fullWidth required variant="standard" onChange={handleChange} />
            <TextField margin="dense" name="description" label="Job Description" fullWidth required multiline rows={4} variant="standard" onChange={handleChange} />
            <TextField margin="dense" name="applicationLink" label="Application Link or Email" fullWidth required variant="standard" onChange={handleChange} />
            <TextField
              margin="dense"
              name="applicationDeadline"
              label="Application Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              variant="standard"
              value={newJob.applicationDeadline}
              onChange={handleChange}
            />
            {jobFormError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>{jobFormError}</Typography>
            )}

            {/* Tags Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Tags</Typography>
              <form onSubmit={handleAddTag}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    label="Add a tag"
                    variant="outlined"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <Button type="submit" variant="contained">
                    Add
                  </Button>
                </Stack>
              </form>

              <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
                {newJob.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Submit for Review
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default JobPostingsPage;
