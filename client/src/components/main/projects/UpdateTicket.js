import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

const UpdateTicket = ({
  ticketId,
  authorId,
  projectId,
  title: prevTitle,
  description: prevDescription,
  status: prevStatus,
  priority: prevPriority,
  type: prevType,
  time: prevTime,
  assignee: prevAssignee,
}) => {
  const [title, setTitle] = useState(prevTitle);
  const [description, setDescription] = useState(prevDescription);
  const [status, setStatus] = useState(prevStatus);
  const [priority, setPriority] = useState(prevPriority);
  const [type, setType] = useState(prevType);
  const [time, setTime] = useState(prevTime);
  const [team, setTeam] = useState([]);
  const [assignee, setAssignee] = useState(prevAssignee || 0);
  const userId = parseInt(localStorage.getItem("userId"));
  const companyId = localStorage.getItem("companyId");

  // fetch list of all project team members
  useEffect(() => {
    const getTeam = async () => {
      try {
        const fetchedTeam = await api.get(`/view/project/team/${projectId}`);
        setTeam(fetchedTeam.data.result);
      } catch (error) {
        console.log(error.message);
      }
    };
    getTeam();
  }, [projectId, companyId]);

  // render list of all project team members for select options
  const teamList = team.map((employee, i) => {
    return (
      <option key={i} value={employee.user_id}>
        {employee.first_name} {employee.last_name}
      </option>
    );
  });

  // submit ticket
  const handleSubmit = async () => {
    console.log(projectId);
    try {
      const updateTicket = await api.put(`/update/ticket/${ticketId}`, {
        userId,
        projectId,
        companyId,
        title,
        description,
        status,
        priority,
        type,
        time,
        assignee,
      });
      console.log(updateTicket);
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
    }
  };

  // delete ticket
  const handleDelete = async () => {
    if (userId === authorId) {
      try {
        await api.delete(`/delete/ticket/${ticketId}`);
        window.location.href = "/";
      } catch (error) {
        console.log(error.message);
      }
    } else {
      return console.log(
        "Submitted request to delete ticket to project owner."
      );
    }
  };

  return (
    <div>
      <h3>Edit Ticket</h3>
      <div>
        <label htmlFor="ticket-title-update">Ticket Title: </label>
        <input
          id="ticket-title-update"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="ticket-description-update">Description: </label>
        <input
          id="ticket-description-update"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="priority-update">Priority:</label>
        <select
          name="priority"
          id="priority-update"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value={0}>N/A</option>
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
          <option value={4}>Urgent</option>
        </select>
      </div>
      <div>
        <label htmlFor="type-update">Type:</label>
        <select
          name="type"
          id="type-update"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value={0}>N/A</option>
          <option value={1}>Issue</option>
          <option value={2}>Feature</option>
          <option value={3}>Bug Fix</option>
        </select>
      </div>
      <div>
        <label htmlFor="time-estimate-update">Time Estimate: </label>
        <input
          id="time-estimate-update"
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status-update">Update Status:</label>
        <select
          name="status"
          id="status-update"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value={0}>Unresolved</option>
          <option value={1}>In Progress</option>
          <option value={2}>Resolved</option>
        </select>
      </div>
      <div>
        <label htmlFor="assignee-update">Assign To:</label>
        <select
          name="assignee"
          id="assignee-update"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value={0}>Unassigned</option>
          {teamList}
        </select>
      </div>
      <button onClick={handleDelete}>Delete Ticket</button>
      <button onClick={handleSubmit}>Update Ticket</button>
    </div>
  );
};

export default UpdateTicket;
