// src/data/alumni.jsx
// Mock data source for Alumni Directory
// Simulates server-side pagination, sorting, and filtering.

const ALUMNI_DATA = [
  {
    id: 1,
    name: 'Aarav Sharma',
    degree: 'B.Tech',
    department: 'Computer Science',
    year: 2019,
    country: 'India',
    industry: 'Software Engineering',
    email: 'aarav.sharma@example.com',
  },
  {
    id: 2,
    name: 'Priya Nair',
    degree: 'M.Tech',
    department: 'Electrical Engineering',
    year: 2020,
    country: 'USA',
    industry: 'Semiconductors',
    email: 'priya.nair@example.com',
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    degree: 'Ph.D.',
    department: 'Mechanical Engineering',
    year: 2018,
    country: 'Germany',
    industry: 'Automotive Research',
    email: 'rohan.mehta@example.com',
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    degree: 'M.Tech',
    department: 'Computer Science',
    year: 2021,
    country: 'Canada',
    industry: 'AI & Machine Learning',
    email: 'sneha.gupta@example.com',
  },
  {
    id: 5,
    name: 'Kiran Kumar',
    degree: 'B.Tech',
    department: 'Mechanical Engineering',
    year: 2017,
    country: 'India',
    industry: 'Manufacturing',
    email: 'kiran.kumar@example.com',
  },
  {
    id: 6,
    name: 'Divya Patel',
    degree: 'Ph.D.',
    department: 'Electrical Engineering',
    year: 2022,
    country: 'UK',
    industry: 'Renewable Energy',
    email: 'divya.patel@example.com',
  },
  {
    id: 7,
    name: 'Neha Singh',
    degree: 'B.Tech',
    department: 'Computer Science',
    year: 2020,
    country: 'Australia',
    industry: 'Cybersecurity',
    email: 'neha.singh@example.com',
  },
  {
    id: 8,
    name: 'Aditya Verma',
    degree: 'M.Tech',
    department: 'Civil Engineering',
    year: 2018,
    country: 'UAE',
    industry: 'Construction Management',
    email: 'aditya.verma@example.com',
  },
  {
    id: 9,
    name: 'Harini Rao',
    degree: 'Ph.D.',
    department: 'Computer Science',
    year: 2016,
    country: 'Singapore',
    industry: 'Data Science Research',
    email: 'harini.rao@example.com',
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMany({ paginationModel, filterModel }) {
  await delay(300); // simulate network latency

  let data = [...ALUMNI_DATA];

  // Apply filter
  if (filterModel) {
    const { degree, department, year, country, industry } = filterModel;

    if (degree) {
      data = data.filter((item) =>
        item.degree.toLowerCase().includes(degree.toLowerCase())
      );
    }

    if (department) {
      data = data.filter((item) =>
        item.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    if (year) {
      data = data.filter(
        (item) => item.year.toString() === year.toString()
      );
    }

    if (country) {
      data = data.filter((item) =>
        item.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    if (industry) {
      data = data.filter((item) =>
        item.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }
  }

  // Pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginated = data.slice(start, end);

  return {
    items: paginated,
    itemCount: data.length,
  };
}
