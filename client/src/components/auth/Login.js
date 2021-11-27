import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../apis/axios";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

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
        navigate("/");
      } else {
        console.log("Unable to login!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <label htmlFor="loginemail">Email:</label>
      <input
        id="loginemail"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <br />
      <label htmlFor="loginpassword">Password:</label>
      <input
        id="loginpassword"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <br />
      <button type="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
