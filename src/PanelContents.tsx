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
        <PanelBox showing={showing} />
        <PanelBox showing={showing} />
        <PanelBox showing={showing} />
        <PanelBox showing={showing} />
        <PanelBox showing={showing} />
        <PanelBox showing={showing} />
        <PanelBox showing={showing} />
      </div>
    </div>
  );
}

function PanelBox({ showing }: { showing: boolean }) {
  const props = useSpring({
    transform: showing ? "scale(1)" : "scale(0.8)",
    opacity: showing ? 1 : 0
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
