import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../../apis/axios";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [team, setTeam] = useState([]);
  const userId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();

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
      const newProject = await api.post("/create/project", {
        title,
        description,
        // deadline,
        userId,
        companyId,
      });
      const projectId = newProject.data.result.insertId;
      team.forEach(async (memberId) => {
        await api.post(`/create/project/team/${projectId}`, { memberId });
      });
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="project-title-create">Project Title</label>
        <input
          id="project-title-create"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="project-description-create">Description</label>
        <input
          id="project-description-create"
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
      <button onClick={handleSubmit}>Create Project</button>
    </div>
  );
};

export default CreateProject;
