import React, { useState, useEffect } from "react";
import api from "../../apis/axios";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

const Register = ({ setAuth }) => {
  const [index, setIndex] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setisAdmin] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [joinCompany, setJoinCompany] = useState("");
  const [newCompanyError, setNewCompanyError] = useState(false);
  const [joinCompanyError, setJoinCompanyError] = useState(false);
  const [isAdminError, setIsAdminError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [companyExists, setCompanyExists] = useState(false);
  const [newCompanyCaption, setNewCompanyCaption] = useState(
    "Register a new company."
  );
  const [joinCompanyCaption, setJoinCompanyCaption] = useState(
    "Join an existing company."
  );
  const [isAdminCaption, setIsAdminCaption] = useState(
    "What is your role within the company?"
  );
  const [fullNameCaption, setFullNameCaption] = useState(
    "Please enter your full name."
  );
  const [emailCaption, setEmailCaption] = useState(
    "Please enter your work email."
  );
  const [passwordCaption, setPasswordCaption] = useState(
    "Please enter a unique password."
  );

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      if (response.data.auth) {
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

  // check if company exists
  useEffect(() => {
    const companyName = joinCompany || newCompany;
    const delayDebounceFn = setTimeout(() => {
      const checkCompanyExists = async () => {
        const existingCompany = await api.get(`/register/${companyName}`);
        if (existingCompany.data.result[0]) {
          setCompanyExists(true);
          if (newCompany) {
            setNewCompanyCaption("A company with this name already exists.");
            setNewCompanyError(true);
          } else if (joinCompany) {
            setJoinCompanyCaption("Company found!");
          }
        } else {
          setCompanyExists(false);
          if (newCompany) {
            setNewCompanyCaption("Company name is available!");
          } else if (joinCompany) {
            setJoinCompanyCaption("Could not find company.");
            setJoinCompanyError(true);
          }
        }
      };
      if (companyName) {
        checkCompanyExists();
      } else {
        setCompanyExists(false);
      }
    }, 1000);

    return () => {
      clearTimeout(delayDebounceFn);
      setNewCompanyCaption("Register a new company.");
      setNewCompanyError(false);
      setJoinCompanyCaption("Join an existing company.");
      setJoinCompanyError(false);
      setIsAdminCaption("What is your role within the company?");
      setIsAdminError(false);
    };
  }, [companyExists, joinCompany, newCompany, isAdmin]);

  useEffect(() => {
    if (fullName) {
      setFullNameError(false);
      setFullNameCaption("Please enter your full name.");
    }
    if (password) {
      setPasswordError(false);
      setPasswordCaption("Please enter a unique password.");
    }
    if (email) {
      setEmailError(false);
      setEmailCaption("Please enter your work email.");
    }
  }, [fullName, email, password]);

  const handleSubmit = async () => {
    if (!fullName) {
      setFullNameError(true);
      setFullNameCaption("Name required.");
    }
    if (!password) {
      setPasswordError(true);
      setPasswordCaption("Password required.");
    }
    if (!email) {
      setEmailError(true);
      setEmailCaption("Email required.");
    }

    // CLIENT SIDE VALIDATION PASSED
    const existingEmail = await api.get(`/register/user/${email}`);
    if (existingEmail.data.result.length) {
      console.log(existingEmail.data.result);
      setEmailError(true);
      return setEmailCaption("An account with this email already exists.");
    }

    // server will ensure company is either joined or created
    const company = joinCompany || newCompany;
    try {
      await api.post("/register", {
        fullName,
        email,
        password,
        company,
        isAdmin,
      });
      handleLogin();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNext = () => {
    if (!isAdmin) {
      setIsAdminCaption("Please define your role within the company.");
      setIsAdminError(true);
    }
    // if both company fields are empty
    if (!joinCompany && !newCompany) {
      setNewCompanyCaption(
        "Please either register or join a company to continue."
      );
      setNewCompanyError(true);
      setJoinCompanyCaption(
        "Please either register or join a company to continue."
      );
      setJoinCompanyError(true);
    }
    // error registering a new company
    if (newCompany && companyExists) {
      setNewCompanyCaption(
        "You cannot register a company that already exists."
      );
      setNewCompanyError(true);
    }
    // error joining existing company
    if (joinCompany && !companyExists) {
      setJoinCompanyCaption("You cannot join a non-existent company.");
      setJoinCompanyError(true);
    }
    // allow next if no errors
    if (
      (isAdmin && newCompany && !companyExists) ||
      (isAdmin && joinCompany && companyExists)
    ) {
      setIndex(1);
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
            {index === 0 ? (
              <React.Fragment>
                <Typography
                  mb={1}
                  variant="h4"
                  color="primary.text"
                  textAlign="center"
                >
                  Company Details
                </Typography>
                <TextField
                  type="text"
                  label="Register Company"
                  fullWidth
                  variant="filled"
                  onChange={(e) => setNewCompany(e.target.value)}
                  value={joinCompany ? "" : newCompany}
                  disabled={joinCompany ? true : false}
                  helperText={newCompanyCaption}
                  autoComplete="off"
                  error={newCompanyError}
                />
                <TextField
                  type="text"
                  label="Join Company"
                  fullWidth
                  variant="filled"
                  onChange={(e) => setJoinCompany(e.target.value)}
                  value={newCompany ? "" : joinCompany}
                  disabled={newCompany ? true : false}
                  helperText={joinCompanyCaption}
                  autoComplete="off"
                  error={joinCompanyError}
                  
                />
                <TextField
                  select
                  label="Role"
                  fullWidth
                  variant="filled"
                  onChange={(e) => setisAdmin(e.target.value)}
                  value={isAdmin}
                  helperText={isAdminCaption}
                  required
                  error={isAdminError}
                >
                  <MenuItem value="0">Developer</MenuItem>
                  <MenuItem value="1">Administrator</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
                <Typography variant="body1" textAlign="center">
                  Already have an account? <Link to="/login">Log In</Link> to
                  continue.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography
                  mb={1}
                  variant="h4"
                  color="primary.text"
                  textAlign="center"
                >
                  Create Account
                </Typography>
                <TextField
                  type="text"
                  label="Full Name"
                  fullWidth
                  variant="filled"
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  required
                  helperText={fullNameCaption}
                  error={fullNameError}
                />
                <TextField
                  type="email"
                  label="Email"
                  fullWidth
                  variant="filled"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  helperText={emailCaption}
                  error={emailError}
                />
                <TextField
                  type="password"
                  label="Password"
                  fullWidth
                  variant="filled"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  helperText={passwordCaption}
                  error={passwordError}
                />
                <Box
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => setIndex(0)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Register
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
