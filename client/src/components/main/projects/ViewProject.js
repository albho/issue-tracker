import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import CreateTicket from "./CreateTicket";
import ViewTickets from "./ViewTickets";
import UpdateProject from "./UpdateProject";

const ViewProject = () => {
  const [index, setIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [showCreateTicket, setShowCreateTicket] = useState(null);
  const companyId = localStorage.getItem("companyId");

  // select project to view
  const handleSelect = async (i, project) => {
    setIndex(i);
    const projectId = project.project_id;
    try {
      const response = await api.get(`/view/project/team/${projectId}`);
      setTeam(response.data.result);
    } catch (error) {
      console.log(error.message);
    }
  };

  // get all projects
  useEffect(() => {
    const getProjects = async () => {
      try {
        // fetch all projects
        const fetchedProjects = await api.get(`/view/projects/${companyId}`);
        if (fetchedProjects) {
          setProjects(fetchedProjects.data.result);
          // since the first project will be shown by default, also fetch and set first project's team by default
          const projectId = fetchedProjects.data.result[0].project_id;
          const initialTeam = await api.get(`/view/project/team/${projectId}`);
          setTeam(initialTeam.data.result);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getProjects();
  }, [companyId]);

  // toggle create ticket button
  const handleClick = (i) => {
    if (showCreateTicket === i) {
      return setShowCreateTicket(null);
    }
    return setShowCreateTicket(i);
  };

  // list of projects
  const projectList = projects.map((project, i) => {
    return (
      <li key={i} style={{ background: "lightblue" }}>
        <div>
          {project.project_title}
          <button onClick={() => handleSelect(i, project)}>View</button>
        </div>
      </li>
    );
  });

  // list of team members
  const teamList = team.map((member, i) => {
    return (
      <li key={i}>
        <div>
          {member.first_name} {member.last_name}
        </div>
        <div>
          {member.email} {member.phone}
        </div>
      </li>
    );
  });

  // all projects
  const allProjects = projects.map((project, i) => {
    return (
      <li key={i} style={{ background: "lightgrey" }}>
        <div>
          <h2>{project.project_title}</h2>
          <div>{project.project_description}</div>
          <div>
            Created by: {project.first_name} {project.last_name} ID:{" "}
            {project.fk_project_author_id}
          </div>
        </div>
        <UpdateProject
          projectId={project.project_id}
          authorId={project.fk_project_author_id}
          title={project.project_title}
          description={project.project_description}
        />
        <hr />
        <button onClick={() => handleClick(i)}>
          {showCreateTicket === i ? "Cancel" : "Create Ticket"}
        </button>
        {showCreateTicket === i && (
          <CreateTicket projectId={project.project_id} />
        )}
        <ViewTickets projectId={project.project_id} />
      </li>
    );
  });

  // to show if no projects
  const noProjects = <div>No Projects</div>;

  return (
    <div>
      <ul>SELECT VIEW: {projectList.length ? projectList : noProjects}</ul>
      {allProjects[index]}
      CURRENT TEAM:
      <ul>{teamList}</ul>
    </div>
  );
};

export default ViewProject;
