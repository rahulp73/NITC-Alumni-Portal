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

const JobPostingsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    // Mock job data
    const mockJobs = [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'Remote',
        description: 'Seeking a skilled React developer to join our team.',
        applicationLink: '#',
        type: 'Full-time',
        tags: ['React', 'JavaScript', 'Remote'],
      },
      {
        id: 2,
        title: 'Data Science Intern',
        company: 'Data Analytics Co.',
        location: 'Bangalore',
        description:
          'Summer internship opportunity for students passionate about data.',
        applicationLink: '#',
        type: 'Internship',
        tags: ['Python', 'Machine Learning', 'Internship'],
      },
      {
        id: 3,
        title: 'Backend Engineer',
        company: 'Innovate Hub',
        location: 'Kozhikode',
        description:
          'Work with Node.js and MongoDB to build scalable APIs.',
        applicationLink: '#',
        type: 'Full-time',
        tags: ['Node.js', 'MongoDB', 'API'],
      },
    ];

    setJobs(mockJobs);
    setLoading(false);
  }, []);

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

  const handleSubmit = () => {
    console.log('Submitting new job:', newJob);
    setJobs((prev) => [...prev, { ...newJob, id: prev.length + 1 }]);
    handleClose();
  };

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
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Post a Job
        </Button>
      </Box>

      {/* Job Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3,
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
                  <Button
                    size="small"
                    variant="contained"
                    component={Link}
                    href={job.applicationLink}
                    target="_blank"
                    rel="noopener"
                  >
                    Apply
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for posting new job */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Post a New Job Opportunity</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="title" label="Job Title" fullWidth variant="standard" onChange={handleChange} />
          <TextField margin="dense" name="company" label="Company Name" fullWidth variant="standard" onChange={handleChange} />
          <TextField margin="dense" name="location" label="Location (e.g., Remote, City)" fullWidth variant="standard" onChange={handleChange} />
          <TextField margin="dense" name="description" label="Job Description" fullWidth multiline rows={4} variant="standard" onChange={handleChange} />
          <TextField margin="dense" name="applicationLink" label="Application Link or Email" fullWidth variant="standard" onChange={handleChange} />

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
    </PageContainer>
  );
};

export default JobPostingsPage;
