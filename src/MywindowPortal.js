import React, { Component } from "react";
import ReactDOM from "react-dom";

const copyStyles = (src, dest) => {
  Array.from(src.styleSheets).forEach((styleSheet) => {
    dest.head.appendChild(styleSheet.ownerNode.cloneNode(true));
  });
  Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
};

window.shownoModalDialog = function (arg1, arg2, arg3) {
  var i;
  var w;
  var h;
  var resizable = "no";
  var scroll = "no";
  var status = "no";
  var mdattrs = arg3.split(";");
  for (i = 0; i < mdattrs.length; i++) {
    var mdattr = mdattrs[i].split(":");
    var n = mdattr[0],
      v = mdattr[1];
    if (n) {
      n = n.trim().toLowerCase();
    }
    if (v) {
      v = v.trim().toLowerCase();
    }
    if (n == "dialogheight") {
      h = v.replace("px", "");
    } else if (n == "dialogwidth") {
      w = v.replace("px", "");
    } else if (n == "resizable") {
      resizable = v;
    } else if (n == "scroll") {
      scroll = v;
    } else if (n == "status") {
      status = v;
    }
  }
  var left = window.screenX + window.outerWidth / 2 - w / 2;
  var top = window.screenY + window.outerHeight / 2 - h / 2;
  if (top > 30) {
    top = top - 30;
  }
  var targetWin = window.open(
    arg1,
    arg2,
    "toolbar=no, location=no, directories=no, status=" +
      status +
      ", menubar=no, scrollbars=" +
      scroll +
      ", resizable=" +
      resizable +
      ", copyhistory=no, width=" +
      w +
      ", height=" +
      h +
      ", top=" +
      top +
      ", left=" +
      left
  );

  return targetWin;
};

export class MyWindowPortal extends React.Component {
  constructor(props) {
    super(props);

    // Step 1: create a container <div>
    this.containeEl = document.createElement("div");
    this.externalWindow = null;
  }

  render() {
    // Step 2: append props.children to the container <div> that isn't mounted yet
    return ReactDOM.createPortal(this.props.children, this.containeEl);
  }

  componentDidMount() {
    // Step 3: open a new browser window and store a reference to it
    this.externalWindow = window.shownoModalDialog(
      "",
      "Print Window",
      "dialogtop:50; dialogleft: 230; center:1; dialogwidth:1590; dialogheight:870; scroll:0; resizable:1"
    );

    // Step 4: append the container <div> (that has props.chi.dren append to it) to
    // the body of the new MyWindowPortal
    this.externalWindow.document.body.appendChild(this.containeEl);

    this.externalWindow.document.title = "Print Tab";
    copyStyles(document, this.externalWindow.document);
  }

  componentWillUnmount() {
    // Step 5: This will fire when this.state.showWindowPortal in the parent componentDidMount
    // become false. So we tidy up by closing the window
    this.externalWindow.close();
  }
}
