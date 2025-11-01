import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Stack,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import PageContainer from '../components/home/components/PageContainer';
import useNotifications from '../components/home/hooks/useNotifications/useNotifications';
import { useParams } from 'react-router-dom';

export default function Profile({ user: initialUser, setUser }) {
  const { userId } = useParams();
  const [user, setUserState] = React.useState(initialUser || null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(!initialUser);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isViewingOtherUser, setIsViewingOtherUser] = React.useState(false);
  const notifications = useNotifications();

  const [formData, setFormData] = React.useState({
    name: '',
    graduationYear: '',
    degreeType: '',
    department: '',
    areaOfExpertise: '',
    industryDomain: '',
    currentLocation: '',
    organization: '',
  });

  // Fetch user data if not provided
  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let res;
        if (userId) {
          // Fetch another user's profile by ID
          setIsViewingOtherUser(true);
          res = await fetch(`http://localhost:8080/user/${userId}`, {
            credentials: 'include',
          });
        } else if (!initialUser) {
          // Fetch current user's profile
          setIsViewingOtherUser(false);
          res = await fetch('http://localhost:8080/userInfo', {
            credentials: 'include',
          });
        } else {
          // Use provided user data
          setIsViewingOtherUser(false);
          setUserState(initialUser);
          setFormData({
            name: initialUser.name || '',
            graduationYear: initialUser.graduationYear || '',
            degreeType: initialUser.degreeType || '',
            department: initialUser.department || '',
            areaOfExpertise: initialUser.areaOfExpertise || '',
            industryDomain: initialUser.industryDomain || '',
            currentLocation: initialUser.currentLocation || '',
            organization: initialUser.organization || '',
          });
          setIsLoading(false);
          return;
        }

        if (res && res.ok) {
          const data = await res.json();
          const userData = data.user || data;
          setUserState(userData);
          setFormData({
            name: userData.name || '',
            graduationYear: userData.graduationYear || '',
            degreeType: userData.degreeType || '',
            department: userData.department || '',
            areaOfExpertise: userData.areaOfExpertise || '',
            industryDomain: userData.industryDomain || '',
            currentLocation: userData.currentLocation || '',
            organization: userData.organization || '',
          });
        } else {
          setError('Failed to load user information');
        }
      } catch (err) {
        setError('Failed to load user information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, initialUser]);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        graduationYear: user.graduationYear || '',
        degreeType: user.degreeType || '',
        department: user.department || '',
        areaOfExpertise: user.areaOfExpertise || '',
        industryDomain: user.industryDomain || '',
        currentLocation: user.currentLocation || '',
        organization: user.organization || '',
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/userInfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserState(updatedUser.user || updatedUser);
        setIsEditing(false);
        notifications.show('Profile updated successfully', {
          severity: 'success',
          autoHideDuration: 3000,
        });
        // Update parent if setUser prop is provided
        if (setUser) {
          setUser(updatedUser.user || updatedUser);
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update profile');
        notifications.show('Failed to update profile', {
          severity: 'error',
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      setError('Failed to update profile');
      notifications.show('Failed to update profile', {
        severity: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Profile">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error && !user) {
    return (
      <PageContainer title="Profile">
        <Alert severity="error">{error}</Alert>
      </PageContainer>
    );
  }

  const displayValue = (value) => value || 'Not specified';

  return (
    <PageContainer
      title="Profile"
      actions={
        !isViewingOtherUser && (
          !isEditing ? (
            <Button variant="contained" onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Stack>
          )
        )
      }
    >
      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Avatar
              src={user?.image}
              alt={user?.name || 'User'}
              sx={{ 
                width: 100, 
                height: 100,
                fontSize: '3rem',
                fontWeight: 600
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" sx={{ fontSize: '1.75rem', fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              {/* <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                {user?.email}
              </Typography> */}
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 4 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' },
                minWidth: { xs: '100%', sm: '200px' },
              },
            }}
          >
            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                />
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{displayValue(user?.name)}</Typography>
                </Box>
              )}
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{user?.email}</Typography>
            </Box>

            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Graduation Year"
                  fullWidth
                  select
                  value={formData.graduationYear}
                  onChange={handleInputChange('graduationYear')}
                >
                  <MenuItem value="">Select Year</MenuItem>
                  {Array.from({ length: 50 }, (_, i) => 1980 + i).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Graduation Year
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {displayValue(user?.graduationYear)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Degree Type"
                  fullWidth
                  select
                  value={formData.degreeType}
                  onChange={handleInputChange('degreeType')}
                >
                  <MenuItem value="">Select Degree</MenuItem>
                  <MenuItem value="BTech">BTech</MenuItem>
                  <MenuItem value="MTech">MTech</MenuItem>
                  <MenuItem value="PhD">PhD</MenuItem>
                </TextField>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Degree Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {displayValue(user?.degreeType)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Department"
                  fullWidth
                  select
                  value={formData.department}
                  onChange={handleInputChange('department')}
                >
                  <MenuItem value="">Select Department</MenuItem>
                  <MenuItem value="CSE">CSE</MenuItem>
                  <MenuItem value="EEE">EEE</MenuItem>
                  <MenuItem value="ECE">ECE</MenuItem>
                  <MenuItem value="ME">ME</MenuItem>
                  <MenuItem value="CE">CE</MenuItem>
                  <MenuItem value="CH">CH</MenuItem>
                  <MenuItem value="ARCHI">ARCHI</MenuItem>
                  <MenuItem value="MME">MME</MenuItem>
                  <MenuItem value="PHY">PHY</MenuItem>
                  <MenuItem value="MATH">MATH</MenuItem>
                  <MenuItem value="SOM">SOM</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </TextField>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {displayValue(user?.department)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Area of Expertise"
                  fullWidth
                  value={formData.areaOfExpertise}
                  onChange={handleInputChange('areaOfExpertise')}
                  placeholder="e.g. Machine Learning, Power Systems"
                />
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Area of Expertise
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {displayValue(user?.areaOfExpertise)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Industry Domain"
                  fullWidth
                  value={formData.industryDomain}
                  onChange={handleInputChange('industryDomain')}
                  placeholder="e.g. IT, Manufacturing"
                />
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Industry Domain
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {displayValue(user?.industryDomain)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Current Location"
                  fullWidth
                  value={formData.currentLocation}
                  onChange={handleInputChange('currentLocation')}
                  placeholder="e.g. Bangalore, India"
                />
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Current Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {displayValue(user?.currentLocation)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditing && !isViewingOtherUser ? (
                <TextField
                  label="Current Organization"
                  fullWidth
                  value={formData.organization}
                  onChange={handleInputChange('organization')}
                  placeholder="e.g. Google, NITC"
                />
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
                    Current Organization
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {displayValue(user?.organization)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
