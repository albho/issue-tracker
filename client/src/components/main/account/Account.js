import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

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
          <div>{first_name}</div>
          <div>{last_name}</div>
          <div>{phone}</div>
          <div>{email}</div>
          <div>Account created: {register_date}</div>
          <div>{is_admin === 0 ? "Basic User" : "Admin"}</div>
        </div>
      );
    } else {
      return <div>No Info</div>;
    }
  };

  return <div>{renderInfo()}</div>;
};

export default Account;
