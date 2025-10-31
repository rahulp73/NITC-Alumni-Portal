import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import getAuthToken from './utils/getAuthToken';

// Routing and Auth
import PrivateRoutes from './PrivateRoutes';
import ProtectedRoutes from './ProtectedRoutes';

// Layouts and Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CrudDashboard from './components/home/CrudDashboard';
import EmployeeList from './components/home/components/EmployeeList';
import EmployeeCreate from './components/home/components/EmployeeCreate';
import EmployeeShow from './components/home/components/EmployeeShow';
import EmployeeEdit from './components/home/components/EmployeeEdit';
import Home from './pages/Home';

import './App.css';
import Events from './pages/Events';
import Alumni from './pages/Alumni';
import Jobs from './pages/Jobs';

function App() {
  const [authToken, setAuthToken] = useState(Boolean(getAuthToken()));

  const GoogleWrapper = () => {
    return <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SignIn setAuthToken={setAuthToken} />
    </GoogleOAuthProvider>;
  }

  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        {/* Routes for unauthenticated users */}
        <Route element={<ProtectedRoutes authToken={authToken} />}>
          <Route path="/signin" element={<GoogleWrapper/>} />
          <Route path="/signup" element={<SignUp setAuthToken={setAuthToken} />} />
        </Route>

        {/* Routes for authenticated users, wrapped in the CrudDashboard layout */}
        <Route element={<PrivateRoutes authToken={authToken} />}>
          <Route path="/" element={<Home setAuthToken={setAuthToken} />}>
            
            {/* CHANGE HERE: The index route now directly renders EmployeeList at "/" */}
            <Route index element={<EmployeeList />} />
            
            {/* The other employee routes can stay the same for resource organization */}
            <Route path="alumni" element={<Alumni/>} />
            <Route path="events" element={<Events/>} />
            <Route path="jobs" element={<Jobs/>} />
            <Route path="employees/new" element={<EmployeeCreate />} />
            <Route path="employees/:employeeId" element={<EmployeeShow />} />
            <Route path="employees/:employeeId/edit" element={<EmployeeEdit />} />

            {/* CHANGE HERE: The fallback now navigates to the root path "/" */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
        
        {/* A top-level fallback for any route that doesn't match */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;