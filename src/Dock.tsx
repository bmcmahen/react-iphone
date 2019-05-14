import * as React from "react";
import "./Dock.css";
import { IconGrid } from "./IconGrid";

interface DockProps {
  items: any;
}

export function Dock(props: DockProps) {
  return (
    <div className="Dock">
      <div className="Dock__content">
        <IconGrid id="dock" items={props.items} />
      </div>
    </div>
  );
}
