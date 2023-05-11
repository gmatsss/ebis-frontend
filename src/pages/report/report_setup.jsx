import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { CKEditor } from "ckeditor4-react";
import { Button } from "@mui/material";

import { toast } from "react-toastify";
import { useFetch } from "../../api/report";
import { UserContext } from "../../UserContext";

const Report_setup = (props) => {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();

  const [show, setShow] = useState(false);

  const setupshow = () => {
    setShow(true);
    setRtpsetup({
      ...rtpsetup,
      _id: props.reportsetup._id,
      reportsetup: props.reportsetup.reportsetup,
    });
  };

  const handleClose = () => {
    setShow(false);
  };

  props.receivesetup(setupshow);

  const [rtpsetup, setRtpsetup] = useState({
    _id: "",
    reportsetup: "",
  });

  useEffect(() => {
    if (!props.reportsetup) return;

    setRtpsetup({
      ...rtpsetup,
      _id: props.reportsetup._id,
      reportsetup: props.reportsetup.reportsetup,
    });
  }, [props.reportsetup]);

  const handle_saved = async () => {
    const details = {
      _id: rtpsetup._id,
      reportsetup: rtpsetup.reportsetup,
      Modifiedby: user,
    };

    const result = await sendRequest("/u/setup/record", "POST", details);
    if (result && result.error) throw result.error;
    handleClose();
    toast.success(result.success);

    props.onreloadsetup();
  };

  return (
    <Modal
      fullscreen={true}
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      enforceFocus={false}
    >
      <Modal.Header closeButton>
        <Modal.Title> Report</Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <div className="m-2" style={{ height: "93%" }}>
          <CKEditor
            initData={rtpsetup.reportsetup}
            config={{
              width: "100%",
              height: 650,
              toolbar: [
                ["Undo", "Redo"],
                ["ExportPdf"],
                ["Source"],
                {
                  name: "style",
                  items: ["Styles", "Format", "Font", "FontSize"],
                },

                ["About"],
                {
                  name: "basicstyles",
                  items: [
                    "Bold",
                    "Italic",
                    "Underline",
                    "Strike",
                    "Subscript",
                    "Superscript",
                    "-",
                    "CopyFormatting",
                    "RemoveFormat",
                  ],
                },
                {
                  name: "paragraph",
                  items: [
                    "NumberedList",
                    "BulletedList",
                    "-",
                    "Outdent",
                    "Indent",
                    "-",
                    "Blockquote",
                    "CreateDiv",
                  ],
                },
                "/",

                ["Print"],
                {
                  name: "insert",
                  items: [
                    "Image",
                    "Flash",
                    "Table",
                    "HorizontalRule",
                    "Smiley",
                    "SpecialChar",
                    "PageBreak",
                    "Iframe",
                  ],
                },
                {
                  name: "colors",
                  items: ["TextColor", "BGColor", "CopyFormatting"],
                },
                {
                  name: "align",
                  items: [
                    "JustifyLeft",
                    "JustifyCenter",
                    "JustifyRight",
                    "JustifyBlock",
                  ],
                },

                {
                  name: "forms",
                  items: [
                    "Form",
                    "Checkbox",
                    "Radio",
                    "TextField",
                    "Textarea",
                    "Select",
                    "Button",
                    "ImageButton",
                    "HiddenField",
                  ],
                },
              ],
              extraPlugins:
                "colorbutton,font,justify,print,tableresize,liststyle,pagebreak,exportpdf,forms",
              // removePlugins: "image",
              cloudServices_uploadUrl:
                "https://33333.cke-cs.com/easyimage/upload/",
              cloudServices_tokenUrl:
                "https://33333.cke-cs.com/token/dev/ijrDsqFix838Gh3wGO3F77FSW94BwcLXprJ4APSp3XQ26xsUHTi0jcb1hoBt",
            }}
            onChange={(event, editor) => {
              setRtpsetup({
                ...rtpsetup,
                reportsetup: event.editor.getData(),
              });
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="contained"
          color="error"
          onClick={handleClose}
          className="me-3"
        >
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={handle_saved}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Report_setup;
