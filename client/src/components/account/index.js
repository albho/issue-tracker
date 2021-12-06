import React, { useState, useEffect } from "react";
import api from "../../apis/axios";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Account = () => {
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem("userId");

  // get user info
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get(`/account/${userId}`);
        console.log(response.data);
        setUserInfo(response.data.result[0]);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [userId]);

  // render user info
  const renderInfo = () => {
    if (userInfo) {
      const { first_name, last_name, email, phone, register_date, is_admin } =
        userInfo;
      return (
        <div>
          <Typography variant="body1" color="text.primary">
            {first_name} {last_name}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {phone}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {email}
          </Typography>
          <Typography variant="body1" color="text.primary">
            Account created: {register_date ? register_date.slice(0, 10) : ""}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {is_admin === 0 ? "Basic User" : "Admin"}
          </Typography>
        </div>
      );
    } else {
      return (
        <Typography variant="body1" color="text.primary">
          No Info
        </Typography>
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" color="text.primary">
            Account
          </Typography>
          {renderInfo()}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Account;
