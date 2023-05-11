import React from "react";
import ReactDOM from "react-dom";
import { CKEditor } from "ckeditor4-react";

const { useState } = React;

const ConfigEvents = () => {
  const [rtpsetup, setRtpsetup] = useState({
    _id: "",
    reportsetup: "",
  });

  console.log(rtpsetup);

  return (
    <div>
      <h2>WYSIWYG editor with custom event handlers and configuration</h2>
      <p>
        Editors created with the CKEditior 4 React component are highly
        customizable. It is possible to overwrite every configuration setting
        using the <code>config</code> property and passing an object containing
        the configuration to it.
      </p>
      <p>
        Additionally, the CKEditor 4 WYSIWYG editor component for React allows
        you to bind any event handler using properties with names starting with{" "}
        <code>on</code>, followed by the name of the event with the first letter
        capitalized. The following example shows how to bind several common
        CKEditor 4 events and apply custom toolbar configuration.
      </p>
      <CKEditor
        initData="This is a CKEditor 4 WYSIWYG editor instance created by ️⚛️ React."
        config={{
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
          cloudServices_uploadUrl: "https://33333.cke-cs.com/easyimage/upload/",
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
  );
};

export default ConfigEvents;
