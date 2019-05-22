import * as React from "react";
import { useTouchable } from "touchable-hook";
import "./Icon.css";

interface IconProps {
  path: string;
  name: string;
  iconOnly?: boolean;
  isEditing: boolean;
  onLongPress: () => void;
}

export function Icon({
  isEditing,
  path,
  name,
  iconOnly,
  onLongPress
}: IconProps) {
  const { bind, active } = useTouchable({
    onLongPress,
    behavior: "button"
  });

  return (
    <div
      style={{
        animationName: active ? "none" : undefined,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none"
      }}
    >
      <div
        {...bind}
        style={{
          filter: active ? "brightness(0.8)" : "none",
          width: "60px",
          height: "78px",
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${path})`
        }}
      >
        <span
          style={{
            fontFamily: "helvetica",
            fontSize: "12px",
            color: "white",
            transition: "opacity 0.3s ease",
            opacity: iconOnly ? 0 : 1
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
