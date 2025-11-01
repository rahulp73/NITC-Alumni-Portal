import { useState, useEffect } from 'react';
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
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [authToken, setAuthToken] = useState(Boolean(getAuthToken()));
  const [user, setUser] = useState(null); // { role: 'student' | 'alumni' | 'admin', ... }

  // Fetch user info after login
  useEffect(() => {
    const fetchUser = async () => {
      if (!authToken) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/userInfo', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [authToken]);

  const GoogleWrapper = () => {
    return <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SignIn setAuthToken={setAuthToken} />
    </GoogleOAuthProvider>;
  };

  // Role-based routing
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        {/* Routes for unauthenticated users */}
        <Route element={<ProtectedRoutes authToken={authToken} />}>
          <Route path="/signin" element={<GoogleWrapper />} />
          <Route path="/signup" element={<SignUp setAuthToken={setAuthToken} />} />
        </Route>

        {/* Routes for authenticated users, wrapped in the CrudDashboard layout */}
        <Route element={<PrivateRoutes authToken={authToken} />}>
          <Route path="/" element={<Home setAuthToken={setAuthToken} user={user} />}>
            {/* Admin route (admin only, protected) */}
            <Route index element={<EmployeeList />} />
            <Route path="alumni" element={<Alumni user={user} />} />
            <Route path="events" element={<Events user={user} />} />
            <Route path="jobs" element={<Jobs user={user} />} />
            {user?.role === 'admin' && (
              <Route path="admin" element={<AdminDashboard />} />
            )}
            <Route path="employees/new" element={<EmployeeCreate />} />
            <Route path="employees/:employeeId" element={<EmployeeShow />} />
            <Route path="employees/:employeeId/edit" element={<EmployeeEdit />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;