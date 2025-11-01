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
import { getMany as getAlumni } from '../components/home/data/alumni.jsx';
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
    const listData = await getAlumni({ paginationModel, filterModel });
    setRowsState({
      rows: listData.items,
      rowCount: listData.itemCount,
    });
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
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'degree', headerName: 'Degree', width: 120 },
    { field: 'department', headerName: 'Department', width: 180 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'country', headerName: 'Location', width: 150 },
    { field: 'industry', headerName: 'Industry / Domain', flex: 1, minWidth: 200 },
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
      </Box>
    </PageContainer>
  );
}
