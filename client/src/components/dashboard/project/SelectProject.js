import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../apis/axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";

import "../../../styles/CustomStyles.css";
import CreateProject from "../actions/CreateProject";

const SelectProject = () => {
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [page, setPage] = useState(1);
  const NUM_PROJECTS_PER_PAGE = 5;
  // FIX - on click, set projectId - to be retrieved on 'view' page
  const handleClick = (project) => {
    localStorage.setItem("projectId", project.project_id);
  };

  // select page of projects to view
  const handleSelectPage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    let isMounted = true;
    const getProjects = async () => {
      const companyId = parseInt(localStorage.getItem("companyId"));
      try {
        // fetch projects
        const response = await api.get(`/view/projects/${companyId}`);
        const fetchedProjects = response.data.result;
        if (isMounted) setProjects(fetchedProjects);

        // set pagination based on number of projects
        const requiredPages = Math.ceil(
          fetchedProjects.length / NUM_PROJECTS_PER_PAGE
        );
        if (isMounted) setNumPages(requiredPages);
      } catch (error) {
        console.log(error.message);
      }
    };
    getProjects();

    return () => {
      isMounted = false;
    };
  }, [projects.length]);

  // only show 3 projects per page
  const filteredProjects = projects.filter(
    (project, i) =>
      Math.ceil((i + 1) / NUM_PROJECTS_PER_PAGE) === parseInt(page)
  );

  return (
    <React.Fragment>
      <Card elevation={3}>
        <CardContent className="headerBoxContainer">
          <Box className="headerBox">
            <Typography variant="h5" color="text.primary">
              All Projects
            </Typography>
            <Button color="primary" onClick={() => setOpenModal(true)}>
              Create
            </Button>
          </Box>
        </CardContent>
        <Divider />
        <ListItem style={{ padding: "0" }}>
          <Grid container alignItems="baseline" justifyContent="space-between">
            <Grid item xs={6}>
              <Typography
                variant="body2"
                color="text.primary"
                style={{
                  padding: "0.4rem 1rem",
                }}
              >
                Title
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Author
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="right"
                style={{ marginRight: "1rem" }}
              >
                Last Updated
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <List style={{ padding: "0" }}>
          {filteredProjects.map((project, i) => {
            return (
              <ListItem key={i} button style={{ padding: "0" }}>
                <Grid
                  container
                  alignItems="baseline"
                  justifyContent="space-between"
                >
                  <Grid item xs={6}>
                    <Link
                      to="/projects"
                      className="customLink"
                      onClick={() => handleClick(project)}
                    >
                      <Typography
                        variant="body1"
                        color="text.primary"
                        style={{
                          padding: "0.4rem 1rem",
                        }}
                      >
                        {project.project_title}
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      className="pointerOnHover"
                      variant="body1"
                      color="text.secondary"
                    >
                      {project.full_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      textAlign="right"
                      style={{ marginRight: "1rem" }}
                    >
                      {project.project_update_date
                        ? project.project_update_date.slice(0, 10)
                        : project.project_create_date.slice(0, 10)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <CardContent style={{ paddingTop: "8px", paddingBottom: "8px" }}>
          <Pagination
            variant="outlined"
            size="small"
            color="primary"
            count={numPages}
            page={page}
            onChange={handleSelectPage}
          />
        </CardContent>
      </Card>
      <CreateProject openModal={openModal} setOpenModal={setOpenModal} />
    </React.Fragment>
  );
};

export default SelectProject;
