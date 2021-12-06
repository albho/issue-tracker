import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { orange, blueGrey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import BootstrapContainer from "react-bootstrap/Container";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "../../styles/CustomStyles.css";
import Footer from "./templates/Footer";

const MainNav = ({ auth, setAuth, toggleTheme }) => {
  const theme = localStorage.getItem("theme");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("companyId");
    localStorage.removeItem("projectId");
    setAuth(false);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar
        className={theme === "dark" ? "navDark" : "navLight"}
        expand="md"
        sticky="top"
        style={{ marginBottom: "1rem" }}
      >
        <Container
          maxWidth="lg"
          component={BootstrapContainer}
          fluid
          style={{ alignItems: "baseline" }}
        >
          <Navbar.Brand>
            <Typography variant="h6" color="text.primary">
              Issue Tracker
            </Typography>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="me-auto"
              style={{ width: "100%", alignItems: "center" }}
            >
              {auth && (
                <Nav.Link as={Link} to="/dashboard" className="navLink">
                  <ListItemButton className="navButton">
                    <Typography variant="body1" color="text.primary">
                      Dashboard
                    </Typography>
                  </ListItemButton>
                </Nav.Link>
              )}
              {auth && (
                <Nav.Link
                  as={Link}
                  to="/account"
                  className="navLink navLinkAccount"
                >
                  <ListItemButton className="navButton">
                    <Typography variant="body1" color="text.primary">
                      Account
                    </Typography>
                  </ListItemButton>
                </Nav.Link>
              )}
              {auth ? (
                <Nav.Link
                  as={Link}
                  to="/"
                  onClick={handleLogout}
                  className="navLink"
                >
                  <ListItemButton className="navButton">
                    <Typography variant="body1" color="text.primary">
                      Log Out
                    </Typography>
                  </ListItemButton>
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="navLink"
                  style={{ marginLeft: "auto" }}
                >
                  <ListItemButton className="navButton">
                    <Typography variant="body1" color="text.primary">
                      Log In
                    </Typography>
                  </ListItemButton>
                </Nav.Link>
              )}
              <IconButton onClick={toggleTheme} style={{ marginLeft: " 1rem" }}>
                {theme === "dark" ? (
                  <Brightness7Icon sx={{ color: orange.A700 }} />
                ) : (
                  <Brightness4Icon sx={{ color: blueGrey.A700 }} />
                )}
              </IconButton>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
      <Footer />
    </Box>
  );
};

export default MainNav;
