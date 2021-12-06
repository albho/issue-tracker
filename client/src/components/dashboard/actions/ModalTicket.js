import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const ModalTicket = ({
  title,
  description,
  status,
  priority,
  type,
  time,
  team,
  assignee,
  setTitle,
  setDescription,
  setStatus,
  setPriority,
  setType,
  setTime,
  setAssignee,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <TextField
              label="Title"
              type="text"
              variant="standard"
              autoComplete="off"
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} order={{ xs: 2, sm: 3 }}>
          <FormControl fullWidth size="small">
            <TextField
              label="Description"
              type="text"
              variant="standard"
              multiline
              autoComplete="off"
              fullWidth
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} order={{ xs: 3, sm: 2 }}>
          <FormControl fullWidth size="small">
            <TextField
              select
              name="assignee"
              label="Assign"
              variant="standard"
              fullWidth
              size="small"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              required
            >
              {team.map((employee, i) => {
                return (
                  <MenuItem key={i} value={employee.user_id}>
                    {employee.full_name}
                  </MenuItem>
                );
              })}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={6} lg={3}>
          <FormControl fullWidth size="small">
            <TextField
              select
              name="status"
              label="Status"
              variant="standard"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <MenuItem value={0}>Unresolved</MenuItem>
              <MenuItem value={1}>In Progress</MenuItem>
              <MenuItem value={2}>Resolved</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} lg={3}>
          <FormControl fullWidth size="small">
            <TextField
              select
              name="type"
              label="Type"
              variant="standard"
              fullWidth
              size="small"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <MenuItem value={0}>Issue</MenuItem>
              <MenuItem value={1}>Feature</MenuItem>
              <MenuItem value={2}>Bug Fix</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} lg={3}>
          <FormControl fullWidth size="small">
            <TextField
              select
              name="priority"
              label="Priority"
              variant="standard"
              fullWidth
              size="small"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <MenuItem value={0}>Low</MenuItem>
              <MenuItem value={1}>Medium</MenuItem>
              <MenuItem value={2}>High</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} lg={3}>
          <FormControl fullWidth size="small">
            <TextField
              select
              name="time-estimate"
              label="Time Estimate"
              type="number"
              variant="standard"
              fullWidth
              size="small"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ModalTicket;
