import * as React from "react";

interface IconProps {
  path: string;
  name: string;
  iconOnly?: boolean;
}

export function Icon({ path, name, iconOnly }: IconProps) {
  return (
    <div
      style={{
        width: "60px",
        height: iconOnly ? "60px" : "78px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${path})`
      }}
    >
      {!iconOnly && (
        <span
          style={{
            fontFamily: "helvetica",
            fontSize: "12px",
            color: "white"
          }}
        >
          {name}
        </span>
      )}
    </div>
  );
}
