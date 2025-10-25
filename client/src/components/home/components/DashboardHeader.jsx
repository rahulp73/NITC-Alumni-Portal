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
import { Link, useNavigate } from 'react-router';
import ThemeSwitcher from './ThemeSwitcher';
import whiteLogoWithFont from '../../../images/WhiteLogoWithFont.png';
import darkLogoWithFont from '../../../images/BlueLogoWithFont.png';
import { Button } from '@mui/material';

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
  },
});

function DashboardHeader({ setAuthToken, logo, title, menuOpen, onToggleMenu }) {

  const navigate = useNavigate();
  
  const theme = useTheme();

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

  // Determine which logo to display based on the theme mode
  const currentLogo = theme.palette.mode === 'dark' ? darkLogoWithFont : whiteLogoWithFont;

  const logout = async () => {
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
                <LogoContainer><img src={currentLogo}/></LogoContainer>
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
            spacing={1}
            sx={{ marginLeft: 'auto' }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button onClick={()=>logout()}>Logout</Button>
            </Stack>
            <Stack direction="row" alignItems="center">
              <ThemeSwitcher />
            </Stack>
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
};

export default DashboardHeader;
