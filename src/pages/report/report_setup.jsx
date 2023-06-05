import React, { useState, useEffect, useContext, useRef } from "react";
import { CKEditor } from "ckeditor4-react"; //install ckeditor4
import { Button } from "@mui/material";

import { useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import { useFetch } from "../../api/report";
import { UserContext } from "../../UserContext";

const Report_setup = (props) => {
  const loc = useLocation();

  console.log(loc.hash.replace("#", ""));

  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();

  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);

  const setupshow = () => {
    setShow(true);
    setRtpsetup({
      ...rtpsetup,
      _id: props.reportsetup._id,
      reportsetup: props.reportsetup.reportsetup,
    });
  };

  // props.receivesetup(setupshow);

  const [rtpsetup, setRtpsetup] = useState({
    _id: "",
    reportsetup: "",
  });

  let shouldlog = useRef(true);
  // datatable in to pass
  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getdata();
    }
  }, []);

  const getdata = async () => {
    const result = await sendRequest(
      `/g/r/record/${loc.hash.replace("#", "")}`,
      "GET"
    );

    setRtpsetup({
      ...rtpsetup,
      _id: result[0]._id,
      reportsetup: result[0].reportsetup,
    });
    setLoad(true);
  };

  console.log(rtpsetup);

  const handle_saved = async () => {
    try {
      const details = {
        _id: rtpsetup._id,
        reportsetup: rtpsetup.reportsetup,
        Modifiedby: user,
      };

      const result = await sendRequest("/u/setup/record", "POST", details);
      if (result && result.error) throw result.error;
      toast.success(result.success);
      setInterval(function () {
        window.close();
      }, 1500);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleClose = () => {
    window.close();
  };
  return (
    load && (
      <div className="">
        <div className="container-fluid mb-1">
          <div className="row ">
            <div className="col-lg-10">
              <h1>Report Setup</h1>
            </div>
            <div className="col-lg-2 mt-2">
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClose()}
                className="me-3"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handle_saved}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        <CKEditor
          initData={rtpsetup.reportsetup}
          config={{
            width: "100%",
            height: 650,
            toolbar: [
              ["Undo", "Redo"],
              ["ExportPdf"],
              ["Source"],
              ["DocProps"],
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
            fullPage: true,

            extraPlugins:
              "colorbutton,font,justify,print,tableresize,liststyle,pagebreak,exportpdf,forms,docprops",
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
    )
  );
};

export default Report_setup;
