import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function copyStyles(src, dest) {
  Array.from(src.styleSheets).forEach((styleSheet) => {
    const styleElement = styleSheet.ownerNode.cloneNode(true);
    styleElement.rel = "stylesheet";
    styleElement.href = styleSheet.href;
    dest.head.appendChild(styleElement);
  });
  Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
}

// function copyStyles(sourceDoc, targetDoc) {
//   Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
//     if (styleSheet.cssRules) {
//       // true for inline styles
//       const newStyleEl = targetDoc.createElement("style");

//       Array.from(styleSheet.cssRules).forEach((cssRule) => {
//         newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText));
//       });

//       targetDoc.head.appendChild(newStyleEl);
//     } else if (styleSheet.href) {
//       // true for stylesheets loaded from a URL
//       const newLinkEl = targetDoc.createElement("link");

//       newLinkEl.rel = "stylesheet";
//       newLinkEl.href = styleSheet.href;
//       targetDoc.head.appendChild(newLinkEl);
//     }
//   });
// }

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

export class MyWindowPortal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.containerEl = null;
    this.externalWindow = null;
  }

  componentDidMount() {
    // STEP 1: Create a new window, a div, and append it to the window. The div
    // *MUST** be created by the window it is to be appended to (Edge only)
    this.externalWindow = window.shownoModalDialog(
      "",
      "Print Window",
      "dialogtop:50; dialogleft: 230; center:1; dialogwidth:1390; dialogheight:770; scroll:0; resizable:1"
    );
    this.containerEl = this.externalWindow.document.createElement("div");
    this.externalWindow.document.body.appendChild(this.containerEl);
    copyStyles(window.document, this.externalWindow.document);
  }

  componentWillUnmount() {
    // STEP 2: This will fire when this.state.showWindowPortal in the parent component
    // becomes false so we tidy up by just closing the window
    this.externalWindow.close();
  }

  render() {
    // STEP 3: The first render occurs before componentDidMount (where we open the
    // new window) so container may be null, in this case render nothing.
    if (!this.containerEl) {
      return null;
    }

    // STEP 4: Append props.children to the container <div> in the new window
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}
