import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import api from "../apis/axios";
import "../styles/CustomStyles.css";
import { lightTheme, darkTheme } from "./theme";
import MainNav from "./layout/MainNav";
import Landing from "./landing";
import Login from "./auth/Login";
import Register from "./auth/Register";
import DashBoard from "./dashboard";
import ViewProject from "./dashboard/project/ViewProject";
import Account from "./account";
import PageNotFound from "./layout/templates/PageNotFound";

const App = () => {
  const [auth, setAuth] = useState(false);
  const [dark, setDark] = useState(false);
  // store theme preference
  const toggleTheme = () => {
    localStorage.setItem("theme", !dark ? "dark" : "light");
    setDark((dark) => !dark);
  };

  useEffect(() => {
    // check authentication
    const checkAuthenticated = async () => {
      const storedId = localStorage.getItem("userId");
      try {
        const response = await api.get("/checkauth");
        if (response.data.auth && storedId) {
          setAuth(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    checkAuthenticated();
  }, []);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <MainNav
                auth={auth}
                setAuth={setAuth}
                toggleTheme={toggleTheme}
              />
            }
          >
            <Route path="/" exact element={<Landing />} />
            {!auth ? (
              <React.Fragment>
                <Route
                  path="/login"
                  exact
                  element={<Login setAuth={setAuth} />}
                />
                <Route
                  path="/register"
                  exact
                  element={<Register setAuth={setAuth} />}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Route
                  path="/dashboard"
                  exact
                  element={<DashBoard auth={auth} />}
                />
                <Route path="/projects" exact element={<ViewProject />} />
                <Route path="/account" exact element={<Account />} />

                <Route path="*" exact element={<PageNotFound />} />
              </React.Fragment>
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
