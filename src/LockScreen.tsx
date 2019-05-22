import * as React from "react";
import { useGestureResponder, StateType } from "react-gesture-responder";
import { useMeasure } from "react-grid-dnd/esm/use-measure";
import { useSpring, animated } from "react-spring";
import { linearConversion } from "./SearchPanel";
import { clamp } from "lodash-es";
import { Status, formatAMPM } from "./Status";
import "./LockScreen.css";
import { format } from "date-fns";

const LOCK_THRESHOLD = 700 / 2;

interface LockScreenProps {
  children: React.ReactNode;
}

export function LockScreen({ children }: LockScreenProps) {
  const ref = React.useRef(null);
  const rightSheet = React.useRef(false);
  const [showing, setShowing] = React.useState(false);

  const { bounds } = useMeasure(ref);

  const [{ y }, setLock] = useSpring(() => ({
    y: 0
  }));

  function onEnd(state: StateType) {
    const [, y] = state.delta;
    const ry = showing ? 700 + y : y;

    function open() {
      setShowing(true);
      setLock({ y: 700, immediate: false });
    }

    function close() {
      setShowing(false);
      setLock({ y: 0, immediate: false });
    }

    if (showing) {
      if (state.initialDirection[1] < 0 && state.velocity > 2) {
        return close();
      }
    }

    return ry > LOCK_THRESHOLD ? open() : close();
  }

  const { bind } = useGestureResponder({
    onStartShouldSet: () => false,
    onRelease: onEnd,
    onTerminate: onEnd,
    onMove: state => {
      setLock({
        y: showing ? 700 + state.delta[1] : state.delta[1],
        immediate: true
      });
    },
    onMoveShouldSet: ({ xy, local, initialDirection }) => {
      if (showing) {
        if (initialDirection[1] < 0) {
          return true;
        }

        return false;
      }

      const { top, left } = bounds;
      const [x, y] = xy;

      const rx = x - left;
      const ry = y - top;

      // moving down from top-left
      if (initialDirection[1] > 0 && ry < 30 && rx < 240) {
        rightSheet.current = false;
        return true;
      }

      // // moving down from top-right
      if (initialDirection[1] > 0 && ry < 30 && rx > 240) {
        rightSheet.current = true;
        return true;
      }

      return false;
    }
  });

  const [time, setTime] = React.useState(formatAMPM());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatAMPM());
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      {...bind}
      style={{
        position: "relative",
        height: "100%",
        width: "100%"
      }}
    >
      <animated.div
        style={{
          position: "absolute",
          bottom: "100%",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          zIndex: 200,
          transform: y.interpolate(y => `translateY(${clamp(y, 0, 700)}px)`)
        }}
      >
        <div
          style={{
            overflow: "hidden",
            background: "rgba(0,0,0,0.1)",
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative"
          }}
        >
          <animated.div
            style={{
              position: "absolute",
              top: "-10px",
              left: "-10px",
              width: "calc(100% + 20px)",
              transform: y.interpolate({
                range: [0, 700],
                output: ["translateY(300px)", "translateY(0px)"],
                extrapolate: "clamp"
              }),
              filter: y.interpolate(
                y => `blur(${convert(clamp(y, 600, 700))}px)`
              ),

              height: "calc(100% + 20px)",
              backgroundImage: `url(https://images.unsplash.com/photo-1558424774-86401550d687?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80)`,
              backgroundSize: "cover"
            }}
          />
          <div
            style={{
              padding: "1.35rem 1.75rem",
              position: "relative"
            }}
          >
            <Status isEditingApps={false} endEditing={() => {}} />
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              flex: 1,
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <div className="LockScreen__time">{time.slice(0, -2)}</div>
            <div className="LockScreen__date">
              {format(new Date(), "dddd, MMM D")}
            </div>
            <div className="LockScreen__button-container">
              <button className="LockScreen__buttons">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>
              <button className="LockScreen__buttons">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>
            <div className="LockScreen__swipe-bar" />
          </div>
        </div>
      </animated.div>
      {children}
    </div>
  );
}

const convert = linearConversion([600, 700], [12, 0]);
