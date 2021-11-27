import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import api from "../apis/axios";
import Layout from "./layout/Layout";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ViewProject from "./main/projects/ViewProject";
import CreateProject from "./main/projects/CreateProject";
import Account from "./main/account/Account";
import PageNotFound from "./utils/PageNotFound";

const App = () => {
  const [auth, setAuth] = useState(false);

  // check authentication
  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        const response = await api.get("/checkauth");
        console.log(response.data);
        if (response.data.auth) {
          setAuth(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    checkAuthenticated();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout auth={auth} setAuth={setAuth} />}>
          {auth ? (
            <>
              <Route path="/" index element={<ViewProject />} />
              <Route path="/create" element={<CreateProject />} />
              <Route path="/account" element={<Account />} />
            </>
          ) : (
            <>
              <Route path="/" index element={<Login setAuth={setAuth} />} />
              <Route
                path="/register"
                element={<Register setAuth={setAuth} />}
              />
            </>
          )}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
