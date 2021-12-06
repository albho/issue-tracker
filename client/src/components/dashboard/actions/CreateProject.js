import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import EventSharpIcon from "@mui/icons-material/EventSharp";
import EventBusySharpIcon from "@mui/icons-material/EventBusySharp";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

import "../../../styles/Modal.css";

const style = {
  bgcolor: "background.paper",
};

const ITEM_HEIGHT = 35;
const ITEM_PADDING_TOP = 0;
const menuprops = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const CreateProject = ({ openModal, setOpenModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState([]);
  const [renderedTeam, setRenderedTeam] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(new Date());
  const [deadlineEnabled, setDeadlineEnabled] = useState(true);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [teamError, setTeamError] = useState(false);
  const handleClose = () => setOpenModal(false);

  const toggleDeadline = (e) => {
    e.stopPropagation();
    setDeadlineEnabled(!deadlineEnabled);
  };

  // fetch list of all employees
  useEffect(() => {
    let isMounted = true;
    const getEmployees = async () => {
      const companyId = parseInt(localStorage.getItem("companyId"));
      try {
        const fetchedEmployees = await api.get(`/employees/${companyId}`);
        if (fetchedEmployees && isMounted)
          setEmployees(fetchedEmployees.data.result);
      } catch (error) {
        console.log(error.message);
      }
    };
    getEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectTeam = (selectedUserId) => {
    let newTeam = [...team];

    if (newTeam.includes(parseInt(selectedUserId))) {
      newTeam = newTeam.filter((ids) => ids !== selectedUserId);
    } else {
      newTeam.push(selectedUserId);
    }
    setTeam(newTeam);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setRenderedTeam(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    if (title) setTitleError(false);
    if (description) setDescriptionError(false);
    if (team.length) setTeamError(false);
  }, [title, description, team]);

  // submit project
  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const companyId = parseInt(localStorage.getItem("companyId"));
    const deadline = deadlineEnabled
      ? date.toISOString().slice(0, 18).replace("T", " ")
      : null;
    const createDate = new Date().toISOString().slice(0, 18).replace("T", " ");

    if (!title) {
      setTitleError(true);
    }
    if (!description) {
      setDescriptionError(true);
    }
    if (!team.length) {
      setTeamError(true);
    }
    if (!title || !description || !team.length) return;

    try {
      const newProject = await api.post("/create/project", {
        title,
        description,
        deadline,
        userId,
        companyId,
        createDate,
      });
      const projectId = newProject.data.result.insertId;
      localStorage.setItem("projectId", projectId);
      team.forEach(async (memberId) => {
        await api.post(`/create/project/team/${projectId}`, { memberId });
      });
      window.location.href = "/projects";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal
      open={openModal}
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
          New Project
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <TextField
                label="Title"
                type="text"
                variant="outlined"
                autoComplete="off"
                fullWidth
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                error={titleError}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                onChange={(newDate) => setDate(newDate)}
                label={deadlineEnabled ? "Deadline" : "No Deadline"}
                inputFormat="MM/dd/yyyy"
                disabled={deadlineEnabled ? false : true}
                value={deadlineEnabled ? date : null}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel htmlFor="toggleDeadline">
                        {deadlineEnabled ? "Deadline" : "No Deadline"}
                      </InputLabel>
                      <OutlinedInput
                        id="toggleDeadline"
                        fullWidth
                        label={deadlineEnabled ? "Deadline" : "No Deadline"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                deadlineEnabled ? "Deadline" : "No Deadline"
                              }
                              onClick={toggleDeadline}
                              edge="end"
                            >
                              {deadlineEnabled ? (
                                <EventSharpIcon />
                              ) : (
                                <EventBusySharpIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        ref={inputRef}
                        {...inputProps}
                      />
                      {InputProps?.endAdornment}
                    </FormControl>
                  </Box>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <TextField
                label="Description"
                type="text"
                variant="outlined"
                multiline
                autoComplete="off"
                fullWidth
                size="small"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                error={descriptionError}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="select-multiple-create-label">Team</InputLabel>
              <Select
                labelId="select-multiple-create-label"
                multiple
                value={renderedTeam}
                onChange={handleChange}
                input={<OutlinedInput label="Team" />}
                renderValue={(selected) => selected.join(", ")}
                menuprops={menuprops}
                required
                error={teamError}
              >
                {employees.map((employee) => {
                  return (
                    <MenuItem
                      key={employee.user_id}
                      value={employee.full_name}
                      onClick={() => handleSelectTeam(employee.user_id)}
                      style={{ padding: "0" }}
                    >
                      <Checkbox
                        checked={renderedTeam.indexOf(employee.full_name) > -1}
                      />
                      <ListItemText primary={employee.full_name} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
      </Box>
    </Modal>
  );
};

export default CreateProject;
