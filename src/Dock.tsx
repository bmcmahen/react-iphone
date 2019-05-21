import * as React from "react";
import "./Dock.css";
import { GridDropZone, GridItem } from "react-grid-dnd";

interface DockProps {
  draggingApp: boolean;
  disableDrag: boolean;
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
          disableDrop={props.draggingApp && props.items.length === 4}
          disableDrag={props.disableDrag}
          id="dock"
          boxesPerRow={4}
          rowHeight={105}
        >
          {props.items.map(item => (
            <GridItem key={item.name}>
              {React.cloneElement(item.icon as any, {
                iconOnly: true
              })}
            </GridItem>
          ))}
        </GridDropZone>
      </div>
    </div>
  );
}
