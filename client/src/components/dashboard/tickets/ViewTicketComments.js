import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import ModalDelete from "../actions/ModalDelete";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "../../../styles/CustomStyles.css";

const ViewTicketComments = ({ ticketId }) => {
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const userId = parseInt(localStorage.getItem("userId"));
  const theme = localStorage.getItem("theme");

  // get all comments
  useEffect(() => {
    let isMounted = true;
    try {
      const getComments = async () => {
        const fetchedComments = await api.get(`/view/comments/${ticketId}`);
        if (isMounted) setAllComments(fetchedComments.data.result);
      };
      getComments();
      return () => {
        isMounted = false;
      };
    } catch (error) {}
  }, [ticketId]);

  // delete comment (if user)
  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/delete/comment/${commentId}`);
      // update state to re-render
      const fetchedComments = await api.get(`/view/comments/${ticketId}`);
      setAllComments(fetchedComments.data.result);
    } catch (error) {
      console.log(error.message);
    }
  };

  // submit comment
  const handleSubmit = async () => {
    if (comment) {
      try {
        await api.post(`/create/comment/${ticketId}`, {
          userId,
          comment,
        });
        // update state to re-render
        const fetchedComments = await api.get(`/view/comments/${ticketId}`);
        setAllComments(fetchedComments.data.result);
        setComment("");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <Card elevation={2}>
      <CardContent className="headerBoxContainer">
        <Box className="headerBox">
          <Typography variant="h5">Comments</Typography>
          {/* <Button color="primary">Notifications</Button> */}
          <IconButton color="primary" size="small">
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </CardContent>
      <Divider className="headerBoxDivider" />
      <CardContent style={{ paddingTop: "0", paddingBottom: "1rem" }}>
        <List style={{ padding: "0" }}>
          {allComments.map((comment, i) => {
            return (
              <ListItem
                key={i}
                alignItems="flex-start"
                style={{ padding: "0" }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={comment.full_name}
                    src="/static/images/avatar/2.jpg"
                  />
                </ListItemAvatar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      style={{ textDecoration: "underline" }}
                      variant="subtitle2"
                      color="text.primary"
                    >
                      {comment.full_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ marginLeft: "auto" }}
                    >
                      {comment.comment_date
                        ? comment.comment_date.slice(0, 16).replace("T", " ")
                        : ""}
                    </Typography>
                  </Box>
                  <Box
                    className={
                      theme === "dark" ? "commentsBoxDark" : "commentsBoxLight"
                    }
                  >
                    <Typography variant="subtitle1" color="text.primary">
                      {comment.comment}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setOpenModalDelete(true)}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                    <ModalDelete
                      openModalDelete={openModalDelete}
                      setOpenModalDelete={setOpenModalDelete}
                      handleDelete={handleDelete}
                      itemId={comment.comment_id}
                      deleteItemType="comment"
                    />
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Box sx={{ flexGrow: "1" }}>
            <Input
              id="ticket-comment"
              placeholder="Write a comment..."
              type="text"
              color="success"
              value={comment}
              autoComplete="off"
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "95%" }}
            />
          </Box>
          <Box>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={comment ? false : true}
            >
              Post
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViewTicketComments;
