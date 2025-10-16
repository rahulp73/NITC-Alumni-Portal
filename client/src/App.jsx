import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PrivateRoutes from './PrivateRoutes'
import ProtectedRoutes from './ProtectedRoutes'
import getAuthToken from './utils/getAuthToken';
import SignIn from './pages/SignIn';
import './App.css'
import AppTheme from './components/shared-theme/AppTheme';


function App() {

  const [authToken, setAuthToken] = useState(Boolean(getAuthToken()))


  return (
    <BrowserRouter>
      <AppTheme>
        <CssBaseline />
        <Routes>
          <Route element={<ProtectedRoutes authToken={authToken} />} >
            <Route path="/signin" element={<SignIn setAuthToken={setAuthToken} />} />
          </Route>
          <Route element={<PrivateRoutes authToken={authToken} />}>
            <Route path="/*" element={<h1>Private Routes</h1>} />
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </AppTheme>
    </BrowserRouter>
  )
}

export default App
