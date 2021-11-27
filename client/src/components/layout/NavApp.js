import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const NavApp = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("companyId");
    setAuth(false);
    navigate("/");
  };

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/account">Account</Link>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default NavApp;
