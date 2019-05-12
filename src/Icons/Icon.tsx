import * as React from "react";

interface IconProps {
  path: string;
}

export function Icon({ path }: IconProps) {
  return (
    <div
      style={{
        width: "60px",
        height: "78px",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${path})`
      }}
    />
  );
}
