import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import EventSharpIcon from "@mui/icons-material/EventSharp";
import EventBusySharpIcon from "@mui/icons-material/EventBusySharp";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

import "../../../styles/Modal.css";

const ITEM_HEIGHT = 35;
const ITEM_PADDING_TOP = 0;
const menuprops = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const style = {
  bgcolor: "background.paper",
};

const EditProject = ({ open, setOpen, project }) => {
  const { project_title, project_description, project_deadline } = project;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState();
  const [team, setTeam] = useState([]);
  const [renderedTeam, setRenderedTeam] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(new Date());
  const [deadlineEnabled, setDeadlineEnabled] = useState(false);
  const userId = parseInt(localStorage.getItem("userId"));
  const projectId = localStorage.getItem("projectId");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const handleClose = () => setOpen(false);

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
    setRenderedTeam(typeof value === "string" ? value.split(",") : value);
  };

  const toggleDeadline = (e) => {
    e.stopPropagation();
    setDeadlineEnabled(!deadlineEnabled);
  };

  useEffect(() => {
    let isMounted = true;
    const getEmployees = async () => {
      const companyId = parseInt(localStorage.getItem("companyId"));
      try {
        const fetchedEmployees = await api.get(`/employees/${companyId}`);
        if (isMounted) setEmployees(fetchedEmployees.data.result);
        const fetchedTeam = await api.get(`/view/project/team/${projectId}`);
        if (isMounted) setTeam(fetchedTeam.data.result);

        // map through prev team, set name
        let prevRenderedTeam = [];
        for (let i = 0; i < fetchedTeam.data.result.length; i++) {
          prevRenderedTeam.push(fetchedTeam.data.result[i].full_name);
        }
        setRenderedTeam(prevRenderedTeam);
      } catch (error) {
        console.log(error.message);
      }
    };
    getEmployees();
    if (isMounted) {
      setTitle(project_title);
      setDescription(project_description);

      if (project_deadline) {
        setDeadlineEnabled(true);
        setDate(new Date(project_deadline));
      } else {
        setDeadlineEnabled(false);
        setDate(null);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [
    projectId,
    companyId,
    project_title,
    project_description,
    project_deadline,
  ]);

  // submit project
  const handleSubmit = async () => {
    const deadline = deadlineEnabled
      ? date.toISOString().slice(0, 18).replace("T", " ")
      : null;
    const updateDate = new Date().toISOString().slice(0, 18).replace("T", " ");
    const updatedBy = userId;
    try {
      // using 'await' in front of delete breaks the code idk why
      await api.put(`/update/project/${projectId}`, {
        title,
        description,
        deadline,
        updatedBy,
        updateDate,
      });

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
          Edit Project
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Title"
                type="text"
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                value={deadlineEnabled ? date : null}
                label={deadlineEnabled ? "Deadline" : "No Deadline"}
                disabled={deadlineEnabled ? false : true}
                sx={{ width: "100%" }}
                inputFormat="MM/dd/yyyy"
                onChange={(newDate) => setDate(newDate)}
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
                        label={deadlineEnabled ? "Deadline" : "No Deadline"}
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
                fullWidth
                size="small"
                label="Description"
                multiline
                autoComplete="off"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="select-multiple-edit-label">Team</InputLabel>
              <Select
                labelId="select-multiple-edit-label"
                multiple
                value={renderedTeam}
                onChange={handleChange}
                input={<OutlinedInput label="Team" />}
                renderValue={(selected) => selected.join(", ")}
                menuprops={menuprops}
                required
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
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            style={{ marginLeft: "1rem" }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProject;
