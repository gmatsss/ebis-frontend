import React, { useState, useEffect, useRef, useContext } from "react";

import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { useFetch } from "../../../api/lupon_api";
import { UserContext } from "../../../UserContext";
const Lup_docs_form = (props) => {
  const { user } = useContext(UserContext);
  //api
  const { sendRequest } = useFetch();

  const [state, setState] = useState(false);
  const [selectdocs, setSelectdocs] = useState();
  const [filerr, setFilerr] = useState(false);

  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (!props.paramsdata) {
      setState(false);
      return;
    }
    setState(true);
  }, [props.paramsdata]);

  const handle_save = async () => {
    if (
      !/jpg|png|pdf|docx|mp4|ppt|xlsx|xls|zip|jpeg|bmp|whatever/.test(
        selectdocs.name
      )
    ) {
      setFilerr(false);
      return toast.warning("Please select valid file");
    }
    try {
      const docsData = new FormData();
      docsData.append("id", props.paramsdata);
      docsData.append("doc_file", selectdocs); //document complain
      docsData.append("Createdby", user.email);
      docsData.append("Modifiedby", user.email);
      const c_docs = await sendRequest("/create/docs", "POST", docsData);
      if (c_docs.error) throw c_docs.error;
      setFilerr(true);
      props.disablecase(false);
      setSelectdocs("");
      props.onReload_t(props.paramsdata);
      return toast.success(c_docs.success);
    } catch (error) {
      return toast.error(error);
    }
  };

  const handle_cancel = () => {
    setSelectdocs("");
    setFilerr(false);
    props.disablecase(false);
  };

  useEffect(() => {
    if (!selectdocs) return;

    props.disablecase(true);
  }, [selectdocs]);

  return (
    <div className="">
      <div className=" d-flex flex-row justify-content-center mt-3">
        <form
          className=""
          id="form-file-upload"
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
          style={{
            opacity: state ? "1" : "0.5",
            pointerEvents: state ? "auto" : "none",
          }}
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
              {!filerr ? (
                <p>
                  Only accept file extenion are
                  jpg,png,pdf,docx,mp4,ppt,xlsx,xls,zip,jpeg,bmp, you can drag
                  and drop your file here or
                </p>
              ) : (
                <p>File format accepted</p>
              )}

              <button className="upload-button" onClick={onButtonClick}>
                {selectdocs ? selectdocs.name : "Upload a file"}
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
      </div>

      <div className=" d-flex flex-row justify-content-evenly mt-2 ">
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          size="large"
          style={{
            opacity: selectdocs ? "1" : "0",
            pointerEvents: selectdocs ? "auto" : "none",
          }}
          color="success"
          onClick={() => {
            handle_save();
          }}
        >
          Save File
        </Button>
        <Button
          variant="contained"
          startIcon={<CancelIcon />}
          size="large"
          style={{
            opacity: selectdocs ? "1" : "0",
            pointerEvents: selectdocs ? "auto" : "none",
          }}
          color="error"
          onClick={() => {
            handle_cancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Lup_docs_form;
