// src/pages/AlumniDirectoryPage.jsx
import * as React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import PageContainer from '../components/home/components/PageContainer.jsx';

const INITIAL_PAGE_SIZE = 10;

export default function Alumni({ user }) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: INITIAL_PAGE_SIZE,
  });

  const [filterModel, setFilterModel] = React.useState({
    degree: '',
    department: '',
    year: '',
    country: '',
    industry: '',
  });

  const [rowsState, setRowsState] = React.useState({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);


  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filterModel.degree) params.append('degreeType', filterModel.degree);
      if (filterModel.department) params.append('department', filterModel.department);
      if (filterModel.year) params.append('graduationYear', filterModel.year);
      if (filterModel.country) params.append('currentLocation', filterModel.country);
      if (filterModel.industry) params.append('industryDomain', filterModel.industry);
      // Pagination (optional, backend can be improved for this)
      // params.append('page', paginationModel.page);
      // params.append('pageSize', paginationModel.pageSize);

      const res = await fetch(`http://localhost:8080/alumni/search?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch alumni');
      const data = await res.json();
      setRowsState({
        rows: data.map(row => ({
          id: row._id || row.id,
          name: row.name,
          degreeType: row.degreeType,
          department: row.department,
          graduationYear: row.graduationYear,
          currentLocation: row.currentLocation,
          industryDomain: row.industryDomain,
          organization: row.organization,
          areaOfExpertise: row.areaOfExpertise,
          email: row.email,
        })),
        rowCount: data.length,
      });
    } catch (e) {
      setRowsState({ rows: [], rowCount: 0 });
    }
    setIsLoading(false);
  }, [paginationModel, filterModel]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (field) => (event) => {
    setFilterModel((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'degreeType', headerName: 'Degree', width: 120 },
    { field: 'department', headerName: 'Department', width: 180 },
    { field: 'graduationYear', headerName: 'Year', width: 100 },
    { field: 'currentLocation', headerName: 'Location', width: 150 },
    { field: 'organization', headerName: 'Organization', width: 180 },
    { field: 'areaOfExpertise', headerName: 'Area of Expertise', width: 200 },
    { field: 'industryDomain', headerName: 'Industry / Domain', flex: 1, minWidth: 200 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
  ];

  const pageTitle = 'Alumni Directory';

  return (
    <PageContainer title={pageTitle}
    //  breadcrumbs={[{ title: pageTitle }]}
     >
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Alumni
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              select
              label="Degree Type"
              // sx={{width:200}}
              fullWidth
              value={filterModel.degree}
              onChange={handleFilterChange('degree')}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="B.Tech">B.Tech</MenuItem>
              <MenuItem value="M.Tech">M.Tech</MenuItem>
              <MenuItem value="Ph.D.">Ph.D.</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              label="Department"
              fullWidth
              value={filterModel.department}
              onChange={handleFilterChange('department')}
              placeholder="e.g., Computer Science"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              label="Graduation Year"
              fullWidth
              value={filterModel.year}
              onChange={handleFilterChange('year')}
              placeholder="e.g., 2021"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              label="Country / Location"
              fullWidth
              value={filterModel.country}
              onChange={handleFilterChange('country')}
              placeholder="e.g., India"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              label="Industry / Domain"
              fullWidth
              value={filterModel.industry}
              onChange={handleFilterChange('industry')}
              placeholder="e.g., AI, IT, Manufacturing"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ flex: 1, width: '100%' }}>
        {rowsState.rowCount === 0 && !isLoading ? (
          <Typography sx={{ m: 4, textAlign: 'center' }} color="text.secondary">
            No alumni to search.
          </Typography>
        ) : (
          <DataGrid
            rows={rowsState.rows}
            rowCount={rowsState.rowCount}
            columns={columns}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            loading={isLoading}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
            }}
          />
        )}
      </Box>
    </PageContainer>
  );
}
