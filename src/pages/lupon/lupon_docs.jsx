import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";

const Lupon_docs = (props) => {
  //form disabled
  const [commandAction, setCommandAction] = useState(false);
  const disableComponent = (status) => {
    setCommandAction(status);
  };

  //get docs
  function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  //docs
  const [selectdocs, setSelectdocs] = useState();
  //instructions
  const [param, setParam] = useState();

  useEffect(() => {
    props.Passdocs(selectdocs);
  }, [selectdocs]);

  const reset_input = () => {
    setSelectdocs("");
  };

  //instructions
  const onCountReceived = async (param) => {
    // console.log(param);
    setParam(param);
    if (param == "ADD") {
      reset_input();
      setCommandAction(true);
    } else if (param == "CANCEL") {
      reset_input();
      setCommandAction(false);
    } else if (param == "REFRESH") {
      reset_input();

      setCommandAction(false);
    } else if (param == "SAVED") {
      // handle_saved();
    } else if (param == "EDIT") {
      setCommandAction(true);
    }
  };

  //instructions
  props.receiverCreator3(onCountReceived);

  function DragDropFile() {
    // drag state
    const [dragActive, setDragActive] = React.useState(false);
    // ref
    const inputRef = React.useRef(null);

    // handle drag events
    const handleDrag = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    // triggers when file is dropped
    const handleDrop = function (e) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setSelectdocs(e.dataTransfer.files[0]);
      }
    };

    // triggers when file is selected with click
    const handleChange = function (e) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        setSelectdocs(e.target.files[0]);
      }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
      inputRef.current.click();
    };

    return (
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button" onClick={onButtonClick}>
              Upload a file
            </button>
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    );
  }

  return (
    <div className="">
      <DragDropFile />

      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Avatar with text and icon
        </Typography>

        <List dense={true}>
          {generate(
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <InsertDriveFileIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Single-line item"
                secondary={"second text"}
              />
            </ListItem>
          )}
        </List>
      </Grid>
    </div>
  );
};

export default Lupon_docs;
