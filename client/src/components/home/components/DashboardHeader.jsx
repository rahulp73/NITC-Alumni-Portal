import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import NotificationIcon from './NotificationIcon';
import whiteLogoWithFont from '../../../images/WhiteLogoWithFont.png';
import darkLogoWithFont from '../../../images/BlueLogoWithFont.png';
import { useMediaQuery, Avatar, Menu, MenuItem } from '@mui/material';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoContainer = styled('div')({
  position: 'relative',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  '& img': {
    maxHeight: 40,
    width: 100,
  },
});

function DashboardHeader({ setAuthToken, logo, title, menuOpen, onToggleMenu, user }) {

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpenState = Boolean(anchorEl);

  const handleMenuOpen = React.useCallback(() => {
    onToggleMenu(!menuOpen);
  }, [menuOpen, onToggleMenu]);

  const getMenuIcon = React.useCallback(
    (isExpanded) => {
      const expandMenuActionText = 'Expand';
      const collapseMenuActionText = 'Collapse';
      return (
        <Tooltip
          title={`${isExpanded ? collapseMenuActionText : expandMenuActionText} menu`}
          enterDelay={1000}
        >
          <div>
            <IconButton
              size="small"
              aria-label={`${isExpanded ? collapseMenuActionText : expandMenuActionText} navigation menu`}
              onClick={handleMenuOpen}
            >
              {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </Tooltip>
      );
    },
    [handleMenuOpen],
  );

  // Use browser theme preference for logo and update on change
  const getPrefersDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [prefersDarkMode, setPrefersDarkMode] = React.useState(getPrefersDarkMode());

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setPrefersDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const currentLogo = prefersDarkMode ? whiteLogoWithFont : darkLogoWithFont;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    // Navigate to profile page when implemented
    navigate('/profile');
  };

  const logout = async () => {
    handleMenuClose();
    try {
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setAuthToken(false); // Redirect to sign-in page after logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <AppBar color="inherit" position="absolute" sx={{ displayPrint: 'none' }}>
      <Toolbar sx={{ backgroundColor: 'inherit', mx: { xs: -0.75, sm: -1 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <Stack direction="row" alignItems="center">
            <Box sx={{ mr: 1 }}>{getMenuIcon(menuOpen)}</Box>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center">
                <LogoContainer><img src={currentLogo} /></LogoContainer>
                {/* {logo ? <LogoContainer>{logo}</LogoContainer> : null} */}
                {/* {title ? (
                  <Typography
                    variant="h6"
                    sx={{
                      color: (theme.vars ?? theme).palette.primary.main,
                      fontWeight: '700',
                      ml: 1,
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                    }}
                  >
                    {title}
                  </Typography>
                ) : null} */}
              </Stack>
            </Link>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            sx={{ marginLeft: 'auto' }}
          >
            {/* <Stack direction="row" alignItems="center">
              <ThemeSwitcher />
            </Stack> */}
            <NotificationIcon />
            <Avatar 
              src={user?.image} 
              alt={user?.name || 'User'} 
              onClick={handleAvatarClick}
              sx={{ 
                width: 32, 
                height: 32,
                cursor: 'pointer'
              }}
              aria-controls={menuOpenState ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpenState ? 'true' : undefined}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={menuOpenState}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

DashboardHeader.propTypes = {
  logo: PropTypes.node,
  menuOpen: PropTypes.bool.isRequired,
  onToggleMenu: PropTypes.func.isRequired,
  title: PropTypes.string,
  user: PropTypes.object,
  setAuthToken: PropTypes.func.isRequired,
};

export default DashboardHeader;
