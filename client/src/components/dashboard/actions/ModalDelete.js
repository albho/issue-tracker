import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

export default function ModalDelete({
  openModalDelete,
  setOpenModalDelete,
  handleDelete,
  itemId,
  deleteItemType,
}) {
  const handleClickDelete = () => {
    handleDelete(itemId);
    setOpenModalDelete(false);
  };

  return (
    <Dialog onClose={() => setOpenModalDelete(false)} open={openModalDelete}>
      <DialogTitle>
        <Typography variant="body1">
          Are you sure you want to delete this {deleteItemType}?
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button color="primary" onClick={() => setOpenModalDelete(false)}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleClickDelete(itemId)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
