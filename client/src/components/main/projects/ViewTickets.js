import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import UpdateTicket from "./UpdateTicket";
import Comments from "./Comments";

const ViewTickets = ({ projectId }) => {
  const [tickets, setTickets] = useState([]);

  // get all tickets
  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await api.get(`/view/tickets/${projectId}`);
        setTickets(response.data.result);
      } catch (error) {
        console.log(error.message);
      }
    };
    getTickets();
  }, [projectId]);

  // list of all tickets
  const allTickets = tickets.map((ticket, i) => {
    return (
      <div key={i}>
        <div>TICKET TITLE: {ticket.ticket_title}</div>
        <UpdateTicket
          ticketId={ticket.ticket_id}
          authorId={ticket.fk_ticket_author_id}
          projectId={projectId}
          title={ticket.ticket_title}
          description={ticket.ticket_description}
          status={ticket.status}
          priority={ticket.priority}
          type={ticket.type}
          time={ticket.time_estimate}
          assignee={ticket.fk_assignee_id}
        />
        <Comments ticketId={ticket.ticket_id} />
      </div>
    );
  });
  return <div>{allTickets}</div>;
};

export default ViewTickets;
