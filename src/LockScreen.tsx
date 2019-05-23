import * as React from "react";
import { useGestureResponder, StateType } from "react-gesture-responder";
import { useMeasure } from "./hooks/use-measure";
import { useSpring, animated } from "react-spring";
import { linearConversion } from "./SearchPanel";
import { clamp } from "lodash-es";
import { Status, formatAMPM } from "./Status";
import "./LockScreen.css";
import { format } from "date-fns";
import { PanelContents } from "./PanelContents";

const PANEL_THRESHOLD = 150;

interface LockScreenProps {
  children: React.ReactNode;
  showLockOnMount?: boolean;
  height: number;
  width: number;
}

/**
 * The lock screen + toggle screen which are invoked
 * by dragging down
 * @param param0
 */

export function LockScreen({
  children,
  height,
  width,
  showLockOnMount = false
}: LockScreenProps) {
  const LOCK_THRESHOLD = height / 2;

  const convert = linearConversion([height - 100, height], [12, 0]);
  const blurFn = linearConversion([0, PANEL_THRESHOLD], [0, 20]);

  const ref = React.useRef(null);
  const rightSheet = React.useRef(false);
  const [showing, setShowing] = React.useState(showLockOnMount);
  const [showingPanel, setShowingPanel] = React.useState(false);
  const [renderPanelItems, setRenderPanelItems] = React.useState(false);

  const { bounds } = useMeasure(ref);

  // lock screen spring
  const [{ y }, setLock] = useSpring(() => ({
    y: showLockOnMount ? height : 0
  }));

  // toggle screen spring
  const [{ top }, setPanel] = useSpring(() => ({
    top: 0
  }));

  React.useEffect(() => {
    if (showing) {
      setLock({ y: height, immediate: true });
    }
  }, [showing, height]);

  // handle drag end
  function onEnd(state: StateType) {
    const [, y] = state.delta;

    // handle drag end for toggle screen
    if (rightSheet.current || showingPanel) {
      const ry = showingPanel
        ? PANEL_THRESHOLD + state.delta[1]
        : state.delta[1];

      const shouldShow = showingPanel
        ? ry > PANEL_THRESHOLD - PANEL_THRESHOLD / 4
        : ry > PANEL_THRESHOLD / 4;

      if (shouldShow) {
        setPanel({ top: PANEL_THRESHOLD, immediate: false });
        setShowingPanel(true);
        setRenderPanelItems(true);
      } else {
        setPanel({ top: 0, immediate: false });
        setShowingPanel(false);
        setRenderPanelItems(false);
      }

      return;
    }

    // handle drag end for lock screen
    const ry = showing ? height + y : y;

    function open() {
      setShowing(true);
      setLock({ y: height, immediate: false });
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

  // bind our gesture reponder
  const { bind } = useGestureResponder({
    onStartShouldSet: () => false,
    onRelease: onEnd,
    onTerminate: onEnd,
    onMove: state => {
      if (rightSheet.current) {
        const ry = showingPanel
          ? PANEL_THRESHOLD + state.delta[1]
          : state.delta[1];

        if (
          state.direction[1] > 0 &&
          ry > LOCK_THRESHOLD / 4 &&
          !renderPanelItems
        ) {
          setRenderPanelItems(true);
        } else if (
          state.direction[1] < 0 &&
          renderPanelItems &&
          ry < LOCK_THRESHOLD - LOCK_THRESHOLD / 4
        ) {
          setRenderPanelItems(false);
        }

        setPanel({
          top: ry,
          immediate: true
        });
        return;
      }

      setLock({
        y: showing ? height + state.delta[1] : state.delta[1],
        immediate: true
      });
    },
    onMoveShouldSet: ({ xy, initialDirection }) => {
      // handle cases where panels are already showing
      if (showing || showingPanel) {
        if (initialDirection[1] < 0) {
          return true;
        }

        return false;
      }

      const { top, left } = bounds;
      const [x, y] = xy;

      const rx = x - left;
      const ry = y - (top + window.scrollY);

      // moving down from top-left
      if (initialDirection[1] > 0 && ry < 30 && rx < width - 100) {
        rightSheet.current = false;
        return true;
      }

      // // moving down from top-right
      if (initialDirection[1] > 0 && ry < 30 && rx > width - 100) {
        rightSheet.current = true;
        return true;
      }

      return false;
    }
  });

  // update our time for the lock screen
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
    <div ref={ref} className="LockScreen" {...bind}>
      <animated.div
        className="LockScreen__toggle-container"
        aria-hidden={!showingPanel}
        style={{
          pointerEvents: showingPanel ? "auto" : "none",
          transform: top.interpolate({
            range: [0, PANEL_THRESHOLD],
            output: ["translateY(-100px)", "translateY(0)"],
            map: y =>
              y > PANEL_THRESHOLD ? y - (y - PANEL_THRESHOLD) * 0.4 : y
          })
        }}
      >
        <PanelContents showing={renderPanelItems} />
      </animated.div>
      <animated.div
        className="LockScreen__blur-bg"
        style={{
          // willChange: "filter",
          filter: top.interpolate(top => {
            return `blur(${blurFn(clamp(top, 0, PANEL_THRESHOLD))}px)`;
          })
        }}
      >
        <animated.div
          aria-hidden={!showing}
          className="LockScreen__content"
          style={{
            transform: y.interpolate(
              y => `translateY(${clamp(y, 0, height)}px)`
            )
          }}
        >
          <div>
            <animated.div
              className="LockScreen__blur-img"
              style={{
                transform: y.interpolate({
                  range: [0, height],
                  output: ["translateY(300px)", "translateY(0px)"],
                  extrapolate: "clamp"
                }),
                // willChange: "filter",
                filter: y.interpolate(
                  y => `blur(${convert(clamp(y, height - 100, height))}px)`
                ),
                backgroundImage: `url(https://images.unsplash.com/photo-1558424774-86401550d687?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80)`
              }}
            />
            <div className="LockScreen__status-container">
              <Status />
            </div>
            <div className="LockScreen__date-time">
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
      </animated.div>
    </div>
  );
}
