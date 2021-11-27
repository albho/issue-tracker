import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

const Comments = ({ ticketId }) => {
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  const userId = parseInt(localStorage.getItem("userId"));

  // get all comments
  useEffect(() => {
    try {
      const getComments = async () => {
        const fetchedComments = await api.get(`/view/comments/${ticketId}`);
        setAllComments(fetchedComments.data.result);
      };
      getComments();
    } catch (error) {}
  }, [ticketId]);

  // delete comment (if user)
  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/delete/comment/${commentId}`);
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
    }
  };

  // submit comment
  const handleSubmit = async () => {
    try {
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

  // list of all comments
  const comments = allComments.map((comment, i) => {
    return (
      <li key={i}>
        <div>{comment.comment}</div>
        <div>
          Written by: {comment.first_name} at {comment.comment_date}
        </div>
        {comment.fk_comment_author_id === userId && (
          <button onClick={() => handleDelete(comment.comment_id)}>
            Delete Comment
          </button>
        )}
      </li>
    );
  });

  return (
    <div>
      <ul>{comments}</ul>
      <div>
        <label htmlFor="ticket-comment">Add a comment: </label>
        <input
          id="ticket-comment"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmit}>Post Comment</button>
      </div>
    </div>
  );
};

export default Comments;
