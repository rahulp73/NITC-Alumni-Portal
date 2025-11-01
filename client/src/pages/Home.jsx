import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom'; // Import Outlet

import DashboardLayout from '../components/home/components/DashboardLayout';
import NotificationsProvider from '../components/home/hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../components/home/hooks/useDialogs/DialogsProvider';
import AppTheme from '../components/shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from '../components/home/theme/customizations';

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

// CrudDashboard no longer defines routes. It now provides the layout and context.
export default function CrudDashboard(props) {
  console.log("Home user prop:", props.user);
  // Pass user prop down for sidebar role-based rendering
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <DashboardLayout setAuthToken={props.setAuthToken} user={props.user}>
            <Outlet context={{ user: props.user }} />
          </DashboardLayout>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}