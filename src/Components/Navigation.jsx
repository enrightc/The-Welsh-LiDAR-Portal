import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ Use React Router for navigation
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

// Contexts
import StateContext from "../Contexts/StateContext"; // Import the StateContext for accessing global state
import { Global } from "@emotion/react";


const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Map", path: "/map" },
];

function Navigation() {
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
  
  const GlobalState = useContext(StateContext); // Access global state
  // This will allow you to access user information from the global state


useEffect(() => {
  console.log("GlobalState in Navigation:", GlobalState);
}, [GlobalState]);

  return (
    <AppBar position="static" sx={{ 
      width: "100%", 
      top: 0, 
      left: 0, 
      backgroundColor: "#1F2827",
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              paddingRight: "65px",
            }}
          >
            The Welsh LiDAR Portal
          </Typography>

          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LiDAR Portal
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
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
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton> */}
              
              {GlobalState.userUsername !== "" ?
                <Button 
                color="inherit"
                variant="outlined"
                onClick={handleOpenUserMenu}
                sx={{ 
                  textTransform: 'none',
                  alignItems: 'flex-start', // ensures left alignment within the button
                }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      Hello, {GlobalState.userUsername}
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "grey.400" }}>
                      Accounts & Settings
                    </Typography>
                  </Box>
                </Button> :

                <Button 
                color="inherit"
                variant="outlined"
                onClick={handleOpenUserMenu}
                sx={{ 
                  textTransform: 'none',
                  alignItems: 'flex-start', // ensures left alignment within the button
                }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      Hello, sign in
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "grey.400" }}>
                      Accounts & Settings
                    </Typography>
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
              {GlobalState.userUsername !== "" ? (
                // Logged-in menu
                <>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Account</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                // Logged-out menu
                <>
                  <MenuItem onClick={handleCloseUserMenu} component={Link} to="/login">
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
    </AppBar>
  );
}

export default Navigation;