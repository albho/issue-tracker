import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../apis/axios";

const Register = ({ setAuth }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [isAdmin, setisAdmin] = useState(0);
  const navigate = useNavigate();

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
        navigate("/");
      } else {
        console.log("Unable to login!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // login after registering
  const handleSubmit = async () => {
    try {
      await api.post("/register", {
        firstName,
        lastName,
        phone,
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

  return (
    <div>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input
          id="phone"
          type="phone"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div>
        <label htmlFor="company">Company:</label>
        <input
          id="company"
          type="text"
          onChange={(e) => setCompany(e.target.value)}
          value={company}
        />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <select
          name="role"
          id="role"
          value={isAdmin}
          onChange={(e) => setisAdmin(e.target.value)}
        >
          <option value={0}>Basic</option>
          <option value={1}>isAdmin</option>
        </select>
      </div>
      <button type="button" onClick={handleSubmit}>
        Register
      </button>
    </div>
  );
};

export default Register;
