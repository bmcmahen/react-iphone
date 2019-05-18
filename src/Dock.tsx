import * as React from "react";
import "./Dock.css";
import { GridDropZone, GridItem } from "react-grid-dnd";

interface DockProps {
  items: Array<{
    name: string;
    icon: React.ReactNode;
  }>;
}

export function Dock(props: DockProps) {
  return (
    <div className="Dock">
      <div className="Dock__content">
        <GridDropZone
          disableDrop={props.items.length === 4}
          id="dock"
          boxesPerRow={4}
          rowHeight={70}
        >
          {props.items.map(item => (
            <GridItem key={item.name}>{item.icon}</GridItem>
          ))}
        </GridDropZone>
      </div>
    </div>
  );
}
