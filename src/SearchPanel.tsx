import * as React from "react";
import { useGestureResponder, StateType } from "react-gesture-responder";
import { useSpring, animated, SpringValue, SpringUpdateFn } from "react-spring";
import { clamp } from "lodash-es";
import "./SearchPanel.css";
import cx from "classnames";
import { Icon as IOSIcon } from "./Icons/Icon";
import settings from "./Icons/Settings.svg";
import messages from "./Icons/Messages.svg";
import reminders from "./Icons/Reminders.svg";
import weather from "./Icons/Weather.svg";
import wallet from "./Icons/Wallet.svg";

interface Props {
  children: React.ReactNode;
  y: SpringValue<number>;
  set: SpringUpdateFn<{
    y: number;
  }>;
}

export const THRESHOLD = 150;

export function SearchPanel({ children, y, set }: Props) {
  const [showing, setShowing] = React.useState(false);

  function onEnd(state: StateType) {
    const up = state.initialDirection[1] < 0;
    const y = up ? THRESHOLD + state.delta[1] : state.delta[1];

    if (y > THRESHOLD / 2) {
      set({ y: THRESHOLD, immediate: false });
      setShowing(true);
    } else {
      set({ y: 0, immediate: false });
      setShowing(false);
    }
  }

  const { bind } = useGestureResponder({
    onStartShouldSet: () => false,
    onRelease: onEnd,
    onTerminate: onEnd,
    onMove: state => {
      const up = state.initialDirection[1] < 0;
      set({
        y: up ? THRESHOLD + state.delta[1] : state.delta[1],
        immediate: true
      });
    },
    onMoveShouldSet: state => {
      if (state.initialDirection[1] > 0 && showing) {
        return false;
      }

      if (state.initialDirection[1] < 0 && !showing) {
        return false;
      }

      if (state.initialDirection[1] !== 0) {
        return true;
      }

      return false;
    }
  });

  return (
    <div
      className="SearchPanel"
      style={{
        position: "relative",
        width: "100%",
        height: "100%"
      }}
      {...bind}
    >
      <animated.div
        style={{
          position: "absolute",
          top: "0",

          pointerEvents: showing ? "auto" : "none",
          opacity: y.interpolate({
            range: [30, THRESHOLD],
            output: [0, 1],
            extrapolate: "clamp"
          }),
          zIndex: 100,
          height: "100%",
          width: "100%",
          padding: "0.5rem",
          paddingTop: "3rem",
          transform: y.interpolate({
            range: [0, THRESHOLD],
            output: ["translateY(-10%)", "translateY(0%)"],
            extrapolate: "clamp"
          })
        }}
      >
        <SearchInput showing={showing} />
        <UppercaseLabel>Siri Suggestions</UppercaseLabel>
        <BoxPane className="BoxPane__suggestions">
          <IOSIcon name="Messages" path={messages} />
          <IOSIcon name="Reminders" path={reminders} />
          <IOSIcon name="Weather" path={weather} />
          <IOSIcon name="Wallet" path={wallet} />
        </BoxPane>
        <BoxPane className="BoxPane__shortcuts">
          <div>
            <div>
              <IOSIcon iconOnly name="Messages" path={messages} />
            </div>
          </div>
          <div>
            <div>
              <IOSIcon iconOnly name="Weather" path={weather} />
            </div>
          </div>
          <div>
            <div>
              <IOSIcon iconOnly name="Reminders" path={reminders} />
            </div>
          </div>
        </BoxPane>
      </animated.div>
      <animated.div
        style={{
          opacity: y.interpolate({
            range: [0, THRESHOLD / 2],
            output: [0, 1],
            extrapolate: "clamp"
          }),
          backgroundColor: "#827877bd",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          pointerEvents: "none"
        }}
      />
      <animated.div
        style={{
          filter: y.interpolate(y => `blur(${fn(clamp(y, 0, THRESHOLD))}px)`),
          height: "100%"
        }}
      >
        {children}
      </animated.div>
    </div>
  );
}

const fn = linearConversion([0, THRESHOLD], [0, 15]);

function linearConversion(a: any, b: any) {
  var o = a[1] - a[0],
    n = b[1] - b[0];

  return function(x: any) {
    return ((x - a[0]) * n) / o + b[0];
  };
}

function BoxPane({
  children,
  className
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx("BoxPane", className)}
      style={{
        minHeight: "100px",
        marginBottom: "0.5rem",
        borderRadius: "1rem",
        background: "rgba(255,255,255,0.2)"
      }}
    >
      {children}
    </div>
  );
}

function SearchInput({ showing }: { showing: boolean }) {
  const input = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (showing) {
      input.current!.focus();
    }
  }, [showing]);

  return (
    <form className="SearchInput">
      <SearchIcon />
      <input ref={input} type="search" placeholder="Search" />
    </form>
  );
}

function UppercaseLabel({ children }: { children: React.ReactNode }) {
  return <div className="UppercaseLabel">{children}</div>;
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
