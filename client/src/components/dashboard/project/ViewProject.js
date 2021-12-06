import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Popover from "@mui/material/Popover";

import api from "../../../apis/axios";
import "../../../styles/CustomStyles.css";
import ViewProjectTeam from "./ViewProjectTeam";
import EditProject from "../actions/EditProject";
import SelectTicket from "../tickets/SelectTicket";
import ViewTicket from "../tickets/ViewTicket";
import EditTicket from "../actions/EditTicket";
import ModalDelete from "../actions/ModalDelete";

const ViewProject = () => {
  const [project, setProject] = useState({});
  const [tickets, setTickets] = useState([]);
  const [team, setTeam] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentTicket, setCurrentTicket] = useState({});
  const [editProject, setEditProject] = useState(false);
  const [editTicket, setEditTicket] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const projectId = localStorage.getItem("projectId");

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let isMounted = true;
    // persist current ticket on page refresh
    if (isMounted && localStorage.getItem("ticketIndex")) {
      const storedIndex = parseInt(localStorage.getItem("ticketIndex"));
      setIndex(storedIndex);
    }
    const getData = async () => {
      const projectId = parseInt(localStorage.getItem("projectId"));
      try {
        const fetchedProject = await api.get(`/view/${projectId}`);
        if (isMounted) setProject(fetchedProject.data.result[0]);
        const fetchedTeam = await api.get(`/view/project/team/${projectId}`);
        if (isMounted) setTeam(fetchedTeam.data.result);
        const fetchedTickets = await api.get(`/view/tickets/${projectId}`);
        if (isMounted) setTickets(fetchedTickets.data.result);
      } catch (error) {
        console.log(error.message);
      }
    };
    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditTicket = (bool, ticket) => {
    setEditTicket(bool);
    setCurrentTicket(ticket);
  };

  const toggleSort = () => {
    const sortedTickets = [...tickets].reverse();
    setTickets(sortedTickets);
  };

  const handleDelete = async () => {
    const projectId = localStorage.getItem("projectId");
    try {
      await api.delete(`/delete/project/${projectId}`);
      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginBottom: "2rem" }}>
      {project ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent className="headerBoxContainer">
                <Box className="headerBox">
                  <Typography variant="h5">View Project</Typography>
                  <IconButton
                    aria-describedby={id}
                    color="primary"
                    size="small"
                    onClick={handleClick}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                  >
                    <Box sx={{ m: 1 }}>
                      <Button
                        color="primary"
                        variant="contained"
                        sx={{ mr: 1 }}
                        onClick={() => setEditProject(true)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setOpenModalDelete(true)}
                      >
                        Delete
                      </Button>
                      <ModalDelete
                        openModalDelete={openModalDelete}
                        setOpenModalDelete={setOpenModalDelete}
                        handleDelete={handleDelete}
                        itemId={projectId}
                        deleteItemType="project"
                      />
                    </Box>
                  </Popover>
                </Box>
              </CardContent>
              <Divider className="headerBoxDivider" />
              <CardContent style={{ paddingTop: "0" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="overline"
                      color="text.primary"
                      className="overlineText"
                    >
                      Title
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.project_title}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={9}>
                    <Typography
                      variant="overline"
                      color="text.primary"
                      className="overlineText"
                    >
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.project_description}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="overline"
                      color="text.primary"
                      className="overlineText"
                    >
                      Author
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.author_full_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="overline"
                      color="text.primary"
                      className="overlineText"
                    >
                      Deadline
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.project_deadline
                        ? project.project_deadline.slice(0, 10)
                        : "No Deadline"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="overline"
                      color="text.primary"
                      className="overlineText"
                    >
                      Created
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.project_create_date
                        ? project.project_create_date.slice(0, 10)
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography
                      variant="overline"
                      color="text.primary"
                      className="overlineText"
                    >
                      Last Updated
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.project_update_date
                        ? project.project_update_date.slice(0, 10)
                        : ""}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <ViewProjectTeam team={team} />
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <SelectTicket
              tickets={tickets}
              index={index}
              setIndex={setIndex}
              toggleSort={toggleSort}
            />
          </Grid>
          <Grid item xs={12}>
            <ViewTicket
              tickets={tickets}
              index={index}
              currentTicket={currentTicket}
              handleEditTicket={handleEditTicket}
            />
          </Grid>
          <EditProject
            open={editProject}
            setOpen={setEditProject}
            project={project}
          />
          <EditTicket
            open={editTicket}
            setOpen={setEditTicket}
            currentTicket={currentTicket}
            currentTeam={team}
            projectId={project.project_id}
          />
        </Grid>
      ) : (
        ""
      )}
    </Container>
  );
};

export default ViewProject;
