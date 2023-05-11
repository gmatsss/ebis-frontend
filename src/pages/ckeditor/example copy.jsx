import React, { useState, useEffect, useContext } from "react";
import { CKEditor } from "ckeditor4-react";

function App() {
  const [rtpsetup, setRtpsetup] = useState({
    _id: "",
    reportsetup: "",
  });

  console.log(rtpsetup);
  return (
    <div className="App">
      <h2>Using CKEditor 4 in React</h2>
      <CKEditor
        initData="<p>Hello from CKEditor 4!</p>"
        onInstanceReady={() => {
          console.log("Editor is ready!");
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
}

export default App;
