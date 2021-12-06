import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import "../../../styles/Modal.css";
import ModalTicket from "./ModalTicket";

const style = {
  bgcolor: "background.paper",
};

const EditTicket = ({
  open,
  setOpen,
  currentTicket,
  projectId,
  currentTeam,
}) => {
  const { ticket_id: ticketId } = currentTicket;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(0);
  const [priority, setPriority] = useState(0);
  const [type, setType] = useState(0);
  const [time, setTime] = useState(0);
  const [team, setTeam] = useState([]);
  const [assignee, setAssignee] = useState(0);
  const userId = parseInt(localStorage.getItem("userId"));

  const handleClose = () => setOpen(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setTitle(currentTicket.ticket_title);
      setDescription(currentTicket.ticket_description);
      setStatus(currentTicket.status);
      setPriority(currentTicket.priority);
      setType(currentTicket.type);
      setTime(currentTicket.time_estimate);
      setTeam(currentTeam);
      setAssignee(currentTicket.assignee_user_id);
    }

    return () => {
      isMounted = false;
    };
  }, [projectId, currentTicket, currentTeam]);

  // submit ticket
  const handleSubmit = async () => {
    const updateDate = new Date().toISOString().slice(0, 18).replace("T", " ");
    const updatedBy = userId;
    try {
      const updateTicket = await api.put(`/update/ticket/${ticketId}`, {
        title,
        description,
        status,
        priority,
        type,
        time,
        assignee,
        updatedBy,
        updateDate,
      });
      console.log(updateTicket);
      window.location.href = "/projects";
    } catch (error) {
      console.log(error.message);
    }
  };

  // delete ticket
  // const handleDelete = async () => {
  //   console.log(authorId);
  //   if (userId === authorId) {
  //     try {
  //       await api.delete(`/delete/ticket/${ticketId}`);
  //       window.location.href = "/projects";
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   } else {
  //     return console.log(
  //       "Submitted request to delete ticket to project owner."
  //     );
  //   }
  // };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="customModal">
        <Typography
          variant="h4"
          color="text.primary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Edit Ticket
        </Typography>
        <ModalTicket
          title={title}
          description={description}
          status={status}
          priority={priority}
          type={type}
          time={time}
          team={team}
          assignee={assignee}
          setTitle={setTitle}
          setDescription={setDescription}
          setStatus={setStatus}
          setPriority={setPriority}
          setType={setType}
          setTime={setTime}
          setAssignee={setAssignee}
        />
        <Grid>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditTicket;
