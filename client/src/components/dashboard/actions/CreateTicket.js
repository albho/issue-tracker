import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import ModalTicket from "./ModalTicket";

import "../../../styles/Modal.css";

const style = {
  bgcolor: "background.paper",
};

const CreateTicket = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [type, setType] = useState(0);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState(0);
  const [team, setTeam] = useState([]);
  const [assignee, setAssignee] = useState("");
  const userId = localStorage.getItem("userId");
  const projectId = localStorage.getItem("projectId");
  const companyId = localStorage.getItem("companyId");

  const handleClose = () => setOpen(false);

  // fetch list of all project team members
  useEffect(() => {
    let isMounted = true;
    const getTeam = async () => {
      try {
        const fetchedTeam = await api.get(`/view/project/team/${projectId}`);
        if (isMounted) setTeam(fetchedTeam.data.result);
      } catch (error) {
        console.log(error.message);
      }
    };
    getTeam();

    return () => {
      isMounted = false;
    };
  }, [projectId, companyId]);
  // submit ticket
  const handleSubmit = async () => {
    const createDate = new Date().toISOString().slice(0, 18).replace("T", " ");
    try {
      // submit ticket
      await api.post(`/create/ticket/${companyId}/${projectId}/${userId}`, {
        title,
        description,
        status,
        type,
        priority,
        time,
        assignee,
        createDate,
      });
      // after creating, view
      localStorage.setItem("ticketIndex", 0);
      window.location.href = "/projects";
    } catch (error) {
      console.log(error.message);
    }
  };

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
          New Ticket
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

export default CreateTicket;
