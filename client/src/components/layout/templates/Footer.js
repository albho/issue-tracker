import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const Footer = () => {
  return (
    <Container
      maxWidth="lg"
      style={{ padding: "1rem 2rem", marginTop: "auto" }}
    >
      <Stack direction="row" spacing={2}>
        <Typography variant="body2" color="text.primary">
          Issue Tracker
        </Typography>
        <Typography variant="body2" color="text.primary">
          © 2022
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          style={{ marginLeft: "auto" }}
        >
          Albert Ho
        </Typography>
      </Stack>
    </Container>
  );
};

export default Footer;
