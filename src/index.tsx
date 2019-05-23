import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { IOS } from "./App";
import * as serviceWorker from "./serviceWorker";
import { AboutTitle, About } from "./About";
import cx from "classnames";
import { Button, IconZoomIn, CloseButton } from "sancho";

function Layout() {
  const [fullscreen, setFullScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    function preventBehavior(e: any) {
      e.preventDefault();
    }

    if (fullscreen) {
      document.addEventListener("touchmove", preventBehavior, {
        passive: false
      });
    }

    return () => {
      document.removeEventListener("touchmove", preventBehavior);
    };
  }, [fullscreen]);

  const [phoneSize, setPhoneSize] = React.useState({
    height: 700,
    width: 375
  });

  function setWindowSize() {
    const h = window.innerHeight;
    const w = window.innerWidth;

    let dim = {
      height: 700,
      width: 375
    };

    if (h < 800) {
      dim.height = h;
    }

    if (w < 475) {
      dim.width = w;
    }

    setPhoneSize(dim);
    setMounted(true);
  }

  React.useEffect(() => {
    setWindowSize();
    window.addEventListener("resize", setWindowSize);
    return () => window.removeEventListener("resize", setWindowSize);
  }, [setWindowSize]);

  return (
    <div
      className={cx("Index", {
        fullscreen
      })}
    >
      <AboutTitle setFullScreen={v => setFullScreen(v)} />

      <div className="Index__ios">
        {fullscreen && (
          <CloseButton
            style={{
              position: "fixed",
              top: "0.5rem",
              right: "0.5rem"
            }}
            onPress={() => setFullScreen(false)}
          />
        )}
        <IOS phoneSize={phoneSize} />
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
