import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

const UpdateProject = ({
  projectId,
  authorId,
  title: prevTitle,
  description: prevDescription,
}) => {
  const [title, setTitle] = useState(prevTitle);
  const [description, setDescription] = useState(prevDescription);
  const [employees, setEmployees] = useState([]);
  const [team, setTeam] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"));
  const companyId = parseInt(localStorage.getItem("companyId"));

  // fetch list of all employees
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const fetchedEmployees = await api.get(`/employees/${companyId}`);
        setEmployees(fetchedEmployees.data.result);
      } catch (error) {
        console.log(error.message);
      }
    };
    getEmployees();
  }, [companyId]);

  // render list of all employees for select options
  const listEmployees = employees.map((employee, i) => {
    return (
      <option key={i} value={employee.user_id}>
        {employee.first_name} {employee.last_name}
      </option>
    );
  });

  // add selected employees to team list
  const handleSelect = (e) => {
    const newTeam = [...e.target.options]
      .filter((o) => o.selected)
      .map((o) => o.value);
    setTeam(newTeam);
  };

  // submit project
  const handleSubmit = async () => {
    try {
      // using 'await' in front of delete breaks the code idk why
      api.delete(`/delete/project/team/${projectId}`);
      await api.put(`/update/project/${projectId}`, {
        title,
        description,
      });
      team.forEach(async (memberId) => {
        await api.post(`/create/project/team/${projectId}`, { memberId });
      });
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // delete project (or submit request if not owner)
  const handleDelete = async () => {
    if (userId === authorId) {
      try {
        await api.delete(`/delete/project/${projectId}`);
        window.location.href = "/";
      } catch (error) {
        console.log(error.message);
      }
    } else {
      return console.log(
        "Submitted request to delete project to project owner."
      );
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="project-title-update">Project Title</label>
        <input
          id="project-title-update"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="project-description-update">Description</label>
        <input
          id="project-description-update"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="team-create">Team:</label>
        <select
          name="team"
          id="team-create"
          value={team}
          multiple
          onChange={(e) => handleSelect(e)}
        >
          {listEmployees}
        </select>
      </div>
      <button onClick={handleDelete}>Delete Project</button>
      <button onClick={handleSubmit}>Update Project</button>
    </div>
  );
};

export default UpdateProject;
