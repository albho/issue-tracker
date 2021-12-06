import React from "react";
import Container from "@mui/material/Container";

import SelectProject from "./project/SelectProject";

const Dashboard = () => {
  return (
    <Container maxWidth="lg" style={{ marginBottom: "2rem" }}>
      <SelectProject />
    </Container>
  );
};

export default Dashboard;
