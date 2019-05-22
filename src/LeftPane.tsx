import * as React from "react";
import { UppercaseLabel, SearchInput } from "./SearchPanel";
import { Icon as IOSIcon } from "./Icons/Icon";
import "./LeftPane.css";
import messages from "./Icons/Messages.svg";
import reminders from "./Icons/Reminders.svg";
import weather from "./Icons/Weather.svg";
import wallet from "./Icons/Wallet.svg";

export function LeftPane() {
  return (
    <div className="LeftPane">
      <SearchInput showing />
      <Box title="Up next">
        <span>No Upcoming Events, Reminders, or Alarms</span>
      </Box>
      <Box title="Siri App Suggestions">
        <IOSIcon name="Messages" path={messages} />
        <IOSIcon name="Reminders" path={reminders} />
        <IOSIcon name="Weather" path={weather} />
        <IOSIcon name="Wallet" path={wallet} />
      </Box>
    </div>
  );
}

function Box({
  children,
  title,
  icon
}: {
  children?: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="LeftPane__Box">
      <div className="LeftPane__Box__title">
        {icon} <UppercaseLabel>{title}</UppercaseLabel>
      </div>
      <div className="LeftPane__Box__content">{children}</div>
    </div>
  );
}
