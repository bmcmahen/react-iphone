import * as React from "react";
import { useSpring, animated } from "react-spring";
import { Status } from "./Status";
import "./PanelContents.css";

interface PanelContentsProps {
  showing: boolean;
}

export function PanelContents({ showing }: PanelContentsProps) {
  return (
    <div className="PanelContents">
      <div>
        <Status endEditing={() => {}} isEditingApps={false} />
      </div>
      <div className="PanelContents__boxes">
        <PanelBox i={0} showing={showing} />
        <PanelBox i={1} showing={showing} />
        <PanelBox i={2} showing={showing} />
        <PanelBox i={3} showing={showing} />
        <PanelBox i={4} showing={showing} />
        <PanelBox i={5} showing={showing} />
        <PanelBox i={6} showing={showing} />
      </div>
    </div>
  );
}

function PanelBox({ showing, i }: { i: number; showing: boolean }) {
  const props = useSpring({
    transform: showing ? "scale(1)" : "scale(0.8)",
    opacity: showing ? 1 : 0,
    delay: !showing ? (7 - i) * 20 : i * 20
  });
  return (
    <animated.div
      className="PanelBox"
      style={{
        ...props
      }}
    />
  );
}
