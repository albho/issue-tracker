import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CreateTicket from "../actions/CreateTicket";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";

import "../../../styles/CustomStyles.css";

const SelectTicket = ({ projectId, tickets, index, setIndex, toggleSort }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [sortButtonText, setSortButtonText] = useState(true);
  const [numPages, setNumPages] = useState(1);
  const [page, setPage] = useState(1);
  const NUM_TICKETS_PER_PAGE = 5;

  const handleSelectPage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    let isMounted = true;
    const requiredPages = Math.ceil(tickets.length / NUM_TICKETS_PER_PAGE);
    if (isMounted) setNumPages(requiredPages);

    return () => {
      isMounted = false;
    };
  }, [tickets.length]);

  const handleListItemClick = (selectedIndex) => {
    setIndex(selectedIndex);
    localStorage.setItem("ticketIndex", selectedIndex);
  };

  // only show 5 tickets per page
  const filteredTickets = tickets.filter(
    (ticket, i) => Math.ceil((i + 1) / NUM_TICKETS_PER_PAGE) === parseInt(page)
  );

  const handleClickSort = () => {
    toggleSort();
    setSortButtonText(!sortButtonText);
  };

  return (
    <Card>
      <CardContent className="headerBoxContainer">
        <Box className="headerBox">
          <Typography variant="h5">Select Ticket</Typography>
          <Button color="primary" onClick={() => setShowCreate(true)}>
            Create
          </Button>
        </Box>
      </CardContent>
      <Divider />
      <List style={{ paddingTop: "0", paddingBottom: "0" }}>
        {tickets.length ? (
          filteredTickets.map((ticket, i) => {
            return (
              <ListItem key={i} selected={index === i} disablePadding>
                <ListItemButton
                  onClick={() => handleListItemClick(i)}
                  className="selectTicketButton"
                >
                  <Typography variant="body1" color="text.primary">
                    {ticket.ticket_title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {ticket.ticket_create_date
                      ? ticket.ticket_create_date.slice(0, 10)
                      : ""}
                  </Typography>
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <ListItem disablePadding>
            <ListItemButton className="selectTicketButton">
              <Typography variant="body2">No Tickets Yet!</Typography>
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <CardContent
        style={{
          paddingTop: "0.6rem",
          paddingBottom: "0.6rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Pagination
          color="primary"
          variant="outlined"
          size="small"
          count={numPages}
          page={page}
          onChange={handleSelectPage}
        />
        <Button
          size="small"
          color="secondary"
          onClick={handleClickSort}
          style={{ marginLeft: "auto" }}
        >
          {sortButtonText ? "oldest first" : "newest first"}
        </Button>
      </CardContent>
      <CreateTicket
        projectid={projectId}
        open={showCreate}
        setOpen={setShowCreate}
      />
    </Card>
  );
};

export default SelectTicket;
