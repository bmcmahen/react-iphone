import * as React from "react";
import "./Dock.css";
import { IconGrid } from "./IconGrid";
import settings from "./Icons/Settings.svg";
import messages from "./Icons/Messages.svg";
import reminders from "./Icons/Reminders.svg";
import { Icon as IOSIcon } from "./Icons/Icon";

interface DockProps {}

export function Dock(props: DockProps) {
  return (
    <div className="Dock">
      <div className="Dock__content">
        <IconGrid
          id="dock"
          items={[
            {
              name: "Ben",
              icon: <IOSIcon iconOnly name="Settings" path={settings} />
            },
            {
              name: "Joe",
              icon: <IOSIcon iconOnly name="Messages" path={messages} />
            },
            {
              name: "Ken",
              icon: <IOSIcon iconOnly name="Reminders" path={reminders} />
            }
          ]}
        />
      </div>
    </div>
  );
}
