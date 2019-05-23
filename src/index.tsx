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

    if (fullscreen) {
      if (w < 375 || h < 700) {
        dim.width = w;
        dim.height = h;
      }
    }

    setPhoneSize(dim);
  }

  React.useEffect(() => {
    setWindowSize();
    window.addEventListener("resize", setWindowSize);
    return () => window.removeEventListener("resize", setWindowSize);
  }, [fullscreen]);

  return (
    <div
      className={cx("Index", {
        fullscreen
      })}
    >
      <AboutTitle
        aria-hidden={fullscreen}
        setFullScreen={v => setFullScreen(v)}
      />

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
      <About aria-hidden={fullscreen} />
    </div>
  );
}

ReactDOM.render(<Layout />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
