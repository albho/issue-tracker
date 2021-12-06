import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../apis/axios";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      if (response.data.auth) {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.result[0].user_id);
        localStorage.setItem(
          "companyId",
          response.data.result[0].fk_company_id
        );
        setAuth(true);
        window.location.href = "/dashboard";
      } else {
        console.log("Unable to login!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        marginTop: "5vh",
      }}
    >
      <Card>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Typography
              mb={1}
              variant="h3"
              color="primary.text"
              textAlign="center"
            >
              Log In
            </Typography>
            <TextField
              type="email"
              label="Email"
              fullWidth
              variant="filled"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <TextField
              type="password"
              label="Password"
              fullWidth
              variant="filled"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <Button variant="contained" color="primary" onClick={handleLogin}>
              Log In
            </Button>
            <Typography variant="body1" textAlign="center">
              Don't have an account? <Link to="/register">Register</Link> to
              continue.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
