import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { IOS } from "./App";
import * as serviceWorker from "./serviceWorker";
import { AboutTitle, About } from "./About";
import cx from "classnames";

function Layout() {
  const [fullscreen, setFullScreen] = useState(false);

  return (
    <div
      className={cx("Index", {
        fullscreen
      })}
    >
      <button onClick={() => setFullScreen(true)}>set full screen</button>
      <AboutTitle />
      <div className="Index__ios">
        <IOS />
      </div>
      <About />
    </div>
  );
}

ReactDOM.render(<Layout />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
