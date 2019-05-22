import * as React from "react";
import { useGestureResponder, StateType } from "react-gesture-responder";
import { useSpring, animated } from "react-spring";
import { clamp } from "lodash-es";

interface Props {
  children: React.ReactNode;
}

const THRESHOLD = 150;

export function SearchPanel({ children }: Props) {
  const [showing, setShowing] = React.useState(false);

  const [{ y }, set] = useSpring(() => ({
    y: 0
  }));

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
        <BoxPane />
        <BoxPane />
        <BoxPane />
      </animated.div>
      <animated.div
        style={{
          opacity: y.interpolate({
            range: [0, THRESHOLD / 2],
            output: [0, 1],
            extrapolate: "clamp"
          }),
          backgroundColor: "#8e8e8eab",
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

function BoxPane() {
  return (
    <div
      style={{
        minHeight: "100px",
        marginBottom: "0.5rem",
        borderRadius: "1rem",
        background: "rgba(255,255,255,0.2)"
      }}
    />
  );
}
