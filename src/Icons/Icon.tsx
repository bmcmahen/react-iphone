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
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none"
      }}
    >
      <div
        style={{
          width: "60px",
          height: iconOnly ? "60px" : "78px",
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
            visibility: iconOnly ? "hidden" : "visible"
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
