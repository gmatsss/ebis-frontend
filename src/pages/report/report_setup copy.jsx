import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button } from "@mui/material";
// NOTE: Use the editor from source (not a build)!
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

import { Essentials } from "@ckeditor/ckeditor5-essentials";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
} from "@ckeditor/ckeditor5-basic-styles";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";

import Font from "@ckeditor/ckeditor5-font/src/font";
import List from "@ckeditor/ckeditor5-list/src/list";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount";
import SpecialCharacters from "@ckeditor/ckeditor5-special-characters/src/specialcharacters";
import SpecialCharactersEssentials from "@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert";
import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";

import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import LinkImage from "@ckeditor/ckeditor5-link/src/linkimage";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";

// import Table from "@ckeditor/ckeditor5-table/src/table";
// import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";

import { toast } from "react-toastify";
import { useFetch } from "../../api/report";
import { UserContext } from "../../UserContext";

const Report_setup = (props) => {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();

  const editorConfiguration = {
    plugins: [
      Essentials,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      ImageInsert,
      Subscript,
      Superscript,
      Paragraph,
      Heading,
      SourceEditing,
      Font,
      List,
      Highlight,
      BlockQuote,
      WordCount,
      SpecialCharacters,
      SpecialCharactersEssentials,
      HorizontalLine,
      Base64UploadAdapter,
      Image,
      ImageToolbar,
      ImageCaption,
      ImageStyle,
      ImageResize,
      LinkImage,
      Alignment,
      // Table,
      // TableToolbar,
    ],
    toolbar: [
      "sourceEditing",
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "strikethrough",
      "subscript",
      "superscript",
      "specialCharacters",
      "|",
      "alignment",
      "blockQuote",
      "highlight",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bulletedList",
      "numberedList",
      "horizontalLine",
      "outdent",
      "indent",
      "|",
      "imageStyle:block",
      "imageStyle:side",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
      "|",
      "linkImage",
      "insertImage",
    ],
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true,
        },
      ],
    },
  };

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
      size="xl"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title> Report</Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <div className="App  m-4">
          <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
            data={rtpsetup.reportsetup}
            onReady={(editor) => {}}
            onChange={(event, editor) => {
              setRtpsetup({
                ...rtpsetup,
                reportsetup: editor.getData(),
              });
            }}
            nBlur={(event, editor) => {}}
            onFocus={(event, editor) => {}}
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
