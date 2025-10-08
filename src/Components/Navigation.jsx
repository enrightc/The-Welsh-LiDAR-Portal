import React, { useState, useContext, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom"; // ✅ Use React Router for navigation
import { useNavigate } from "react-router-dom";
// MUI Imports
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';

import logo from "./Assets/mainLogoWhite.png"; 


// Contexts
import StateContext from "../Contexts/StateContext"; // Import the StateContext for accessing global state
import DispatchContext from "../Contexts/DispatchContext";
import { Global } from "@emotion/react";

const pages = [
  { name: "About", path: "/about" },
  { name: "How It Works", path: "/HowItWorks" },
  { name: "Lidar Portal", path: "/LidarPortal" },
  { name: "Feedback", path: "/feedback" },
  { name: "News", path: "/news" },
];


function Navigation() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // LOGOUT Confirmation
  // state varbale called openLogoutDialog is created.
  // - It starts as false (dialog hidden).
  // - setOpenLogoutDialog is the function React gives us to change it.
  // - openLogout() is a helper that sets it to true (shows the dialog).
  // - closeLogout() is a helper that sets it to false (hides the dialog).

  // openLogoutDialog = state value (starts as false, so the dialog is hidden)
  // setOpenLogoutDialog = function we call to change openLogoutDialog later
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // openLogout() sets openLogoutDialog to true (shows the dialog)
  // closeLogout() sets openLogoutDialog to false (hides the dialog)
  const openLogout = () => setOpenLogoutDialog(true); 
  const closeLogout = () => setOpenLogoutDialog(false); 

  // This is how you read from Global State
  // This will allow you to access user information from the global state
  const GlobalState = useContext(StateContext); 

  // This is how you update/change the Global State.
  // This will allow you to dispatch actions to update the global state
  const GlobalDispatch = useContext(DispatchContext); 
  
  // Runs the actual logout request (no UI confirm here; the Dialog handles that)
  // Because function is marked async it knows it may need to pause somewhere
  async function handleLogout() {
  // 1) Close the little avatar menu so the UI feels responsive.
  setAnchorElUser(null);

  try {
    // 2) Get the token. Prefer the one in global state,
    //    but fall back to localStorage if needed.
    const token = GlobalState.userToken || localStorage.getItem("authToken");

    // 3) If we have a token, TELL THE SERVER to invalidate it.
    //    (Djoser doesn't need a body → pass `null`.)
    if (token) {
      await api.post(
        "/api-auth-djoser/token/logout/",
        null,
        { headers: { Authorization: `Token ${token}` } }
      );
    }
    // If no token, we skip the server call — we’ll still clean up locally.

  } catch (e) {
    // Handle server wake or token already invalid gracefully.
    const status = e?.response?.status;
    if (!status || [502, 503, 504].includes(status)) {
      // Likely server waking up or transient network error.
      // still log out locally in finally().
    } else if (status === 401) {
      // Token already invalid on the server — fine; will clear locally.
    } else {
      // Other server error — still proceed to local logout in finally().
      if (import.meta.env.DEV) {
        console.error("Logout error:", e?.response || e);
      }
    }
  } finally {
    // 5) The GUARANTEE: client is logged out no matter what.
    //    (This is the fix for being “stuck logged in”.)
    localStorage.removeItem("authToken");

    // Also remove the default Authorization header from our Axios instance
    if (api?.defaults?.headers?.common?.Authorization) {
      delete api.defaults.headers.common["Authorization"];
    }

    // 6) Tell global state “we’re logged out”
    GlobalDispatch({ type: "Logout" });

    // 7) Send the user home with a happy toast.
    navigate("/", { state: { toast: "Successfully logged out!" } });
  }
}

  function handleProfile() {
    setAnchorElNav(null);
    navigate("/profile");
  }

  return (
    <AppBar position="static" sx={{ 
      width: "100%", 
      top: 0, 
      left: 0, 
      backgroundColor: "#232138",
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box
            component={Link}
            to="/"
            aria-label="Go to homepage"
            sx={{
              mr: 2,
              display: { xs: "none" },
              "@media (min-width:1296px)": { display: "flex" },
              alignItems: "center",
              textDecoration: "none",
              paddingRight: 5,
              paddingLeft: 20,
            }}
          >
            <Tooltip
              title="The Welsh LiDAR Portal - Home"
              slotProps={{
                tooltip: { sx: { fontSize: '1rem', lineHeight: 1.3 } }
              }}
            >
              <Box component="img" src={logo} alt="The Welsh LiDAR Portal logo" sx={{ height: 50, width: "auto", display: "block" }} />
            </Tooltip>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", lg: "none" } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link
                      to={page.path}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {page.name}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box
            component={Link}
            to="/"
            aria-label="Go to homepage"
            sx={{
              flexGrow: 1,
              display: { xs: "flex" },
              "@media (min-width:1296px)": { display: "none" },
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="The Welsh LiDAR Portal logo"
              sx={{ height: 40, width: "auto", display: "block" }}
            />
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name} // ✅ Fixed key
                component={Link} // ✅ Use React Router's <Link>
                to={page.path} // ✅ Navigate correctly
                sx={{ my: 2, color: "white", display: "block", px: 4}}
              >
                {page.name} {/* ✅ Ensure only "name" is displayed */}
              </Button>
            ))}
          </Box>

          {/* User Profile Menu */}
          <Box sx={{ flexGrow: 0,
          mr: { xs: 0, sm: 0, md: 2, lg: 20 },
            
           }}>
            <Tooltip title="Open settings">
              {GlobalState.userIsLoggedIn ?
                <Button 
                  color="inherit"
                  variant="outlined"
                  onClick={handleOpenUserMenu}
                  sx={{ 
                    textTransform: 'none',
                    alignItems: 'flex-start', // ensures left alignment within the button
                    border: '1px solid transparent', // invisible border for layout stability
                    '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)', // light overlay
                    
                    },
                  }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "row",
                    gap: 0.5,
                    alignItems: "flex-start",
                    }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {GlobalState.userUsername}
                    </Typography>
                    <ArrowRightOutlinedIcon />
                    <AccountCircleOutlinedIcon />
                  </Box>
                </Button> :

                <Button 
                  color="inherit"
                  variant="outlined" 
                  onClick={handleOpenUserMenu}
                  sx={{ 
                    textTransform: 'none',
                    alignItems: 'flex-start', // ensures left alignment within the button
                    border: '1px solid transparent', // invisible border for layout stability
                    '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)', // light overlay
                      },
                  }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "row", 
                    alignItems: "flex-start",
                    gap: 2,
                  }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      Hello, 
                    </Typography>
                    <AccountCircleOutlinedIcon />
                  </Box>
                </Button>
              }
            </Tooltip>
            
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ mt: "45px" }}
            >
              {GlobalState.userIsLoggedIn ? (
                // Logged-in menu
                <>
                  <MenuItem onClick={handleProfile}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/account"); }}>
                    <Typography textAlign="center">Account</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/dashboard"); }}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/users"); }}>
                    <Typography textAlign="center">Users</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); openLogout(); }}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                // Logged-out menu
                <>
                  <MenuItem 
                    onClick={
                      handleCloseUserMenu} 
                      component={Link} 
                      to="/login"
                  >
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>

                  <MenuItem onClick={handleCloseUserMenu} component={Link} to="/register">
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      <Dialog
        open={openLogoutDialog}
        onClose={closeLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography id="logout-dialog-description">
            Are you sure you want to log out?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogout}>Cancel</Button>
          <Button
            onClick={() => {
              handleLogout();
              closeLogout();
            }}
            color="error"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>

    
  );
}

export default Navigation;