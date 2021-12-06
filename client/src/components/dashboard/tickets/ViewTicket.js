import React, { useState } from "react";
import "../../../styles/CustomStyles.css";
import api from "../../../apis/axios";
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

import ViewTicketComments from "./ViewTicketComments";
import ModalDelete from "../actions/ModalDelete";

const readPriority = (priorityCode) => {
  if (priorityCode === 0) return "Low";
  if (priorityCode === 1) return "Medium";
  if (priorityCode === 2) return "High";
};

const readType = (typeCode) => {
  if (typeCode === 0) return "Issue";
  if (typeCode === 1) return "Feature";
  if (typeCode === 2) return "Bug Fix";
};

const readStatus = (statusCode) => {
  if (statusCode === 0) return "Unresolved";
  if (statusCode === 1) return "In Progress";
  if (statusCode === 2) return "Resolved";
};

const ViewTicket = ({ tickets, index, handleEditTicket, currentTicket }) => {
  const { ticket_id: ticketId, author_user_id: authorId } = currentTicket;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const projectId = localStorage.getItem("projectId");
  const userId = parseInt(localStorage.getItem("userId"));

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async () => {
    console.log(authorId);
    if (userId === authorId) {
      try {
        await api.delete(`/delete/ticket/${ticketId}`);
        window.location.href = "/projects";
      } catch (error) {
        console.log(error.message);
      }
    } else {
      return console.log(
        "Submitted request to delete ticket to project owner."
      );
    }
  };
  const showTicket = tickets.map((ticket, i) => {
    return (
      <Grid key={i} container spacing={2}>
        <Grid item xs={12} md={7} container>
          <Card elevation={3}>
            <CardContent className="headerBoxContainer">
              <Box className="headerBox">
                <Typography variant="h5">View Ticket Info</Typography>
                <IconButton color="primary" size="small" onClick={handleClick}>
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
                      onClick={() => handleEditTicket(true, ticket)}
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
                      deleteItemType="ticket"
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
                    {ticket.ticket_title}
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
                    {ticket.ticket_description}
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
                    {ticket.author_full_name}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="overline"
                    color="text.primary"
                    className="overlineText"
                  >
                    Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {readStatus(ticket.status)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="overline"
                    color="text.primary"
                    className="overlineText"
                  >
                    Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {readType(ticket.type)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="overline"
                    color="text.primary"
                    className="overlineText"
                  >
                    Priority
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {readPriority(ticket.priority)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="overline"
                    color="text.primary"
                    className="overlineText"
                  >
                    Assigned Devs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.assignee_full_name}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="overline"
                    color="text.primary"
                    className="overlineText"
                  >
                    Time Estimate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.time_estimate}{" "}
                    {ticket.time_estimate === 1 ? "hour" : "hours"}
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
                    {ticket.ticket_create_date
                      ? ticket.ticket_create_date.slice(0, 10)
                      : "Missing Date"}
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
                    {ticket.ticket_update_date
                      ? ticket.ticket_update_date.slice(0, 10)
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <ViewTicketComments ticketId={ticket.ticket_id} />
        </Grid>
      </Grid>
    );
  });

  return <div>{showTicket[index]}</div>;
};

export default ViewTicket;
