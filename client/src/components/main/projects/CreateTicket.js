import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

const CreateTicket = ({ projectId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [type, setType] = useState(0);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState(0);
  const [comment, setComment] = useState("");
  const [team, setTeam] = useState([]);
  const [assignee, setAssignee] = useState(0);
  const userId = localStorage.getItem("userId");
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
    try {
      // submit ticket
      const newTicket = await api.post(
        `/create/ticket/${companyId}/${projectId}/${userId}`,
        {
          title,
          description,
          status,
          priority,
          type,
          time,
          assignee,
        }
      );
      const ticketId = newTicket.data.result.insertId;
      // submit comment separately (different SQL table)
      const newComment = await api.post(`/create/comment/${ticketId}`, {
        userId,
        comment,
      });
      console.log(newComment);
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <h3>Create a Ticket</h3>
      <div>
        <label htmlFor="ticket-title-create">Ticket Title: </label>
        <input
          id="ticket-title-create"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="ticket-description-create">Description: </label>
        <input
          id="ticket-description-create"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="priority-create">Priority:</label>
        <select
          name="priority"
          id="priority-create"
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
        <label htmlFor="type-create">Type:</label>
        <select
          name="type"
          id="type-create"
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
        <label htmlFor="time-estimate-create">Time Estimate: </label>
        <input
          id="time-estimate-create"
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status-create">Status:</label>
        <select
          name="status"
          id="status-create"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value={0}>Unresolved</option>
          <option value={1}>In Progress</option>
          <option value={2}>Resolved</option>
        </select>
      </div>
      <div>
        <label htmlFor="ticket-comment">Add a comment: </label>
        <input
          id="ticket-comment"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="assignee-create">Assign To:</label>
        <select
          name="assignee"
          id="assignee-create"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value={0}>Unassigned</option>
          {teamList}
        </select>
      </div>
      <button onClick={handleSubmit}>Submit Ticket</button>
    </div>
  );
};

export default CreateTicket;
