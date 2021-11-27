import React from "react";
import { Outlet } from "react-router";
import NavApp from "./NavApp";
import NavAuth from "./NavAuth";

const Layout = ({ auth, setAuth }) => {
  // if logged in, show app navbar; else, show register/login navbar
  return (
    <div style={{ border: "1px solid red", margin: "0" }}>
      {auth ? <NavApp setAuth={setAuth} /> : <NavAuth />}
      <Outlet />
    </div>
  );
};

export default Layout;
