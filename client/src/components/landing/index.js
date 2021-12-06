import React from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const index = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" color="text.primary">
        Welcome!
      </Typography>
      <Typography variant="body1" color="text.primary">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. A, ducimus.
      </Typography>
      <Typography variant="body1" color="text.primary">
        Please <Link to="/login">Log In</Link> or{" "}
        <Link to="/register">Register</Link> to continue.
      </Typography>
    </Container>
  );
};

export default index;
