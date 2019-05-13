import * as React from "react";
import { Bounds } from "./hooks/use-measure";

export const DragContext = React.createContext({
  register: (id: string, bounds: any) => {},
  remove: (id: string) => {},
  getCurrentDropId: (id: string, x: number, y: number) => {}
});

interface Props {
  children: React.ReactNode;
}

export function DragContextProvider({ children }: Props) {
  const refs = React.useRef<Map<string, Bounds>>(new Map());

  function register(id: string, bounds: any) {
    refs.current.set(id, bounds);
  }

  function remove(id: string) {
    refs.current.delete(id);
  }

  function getFixedPosition(id: string, x: number, y: number) {
    const bounds = refs.current.get(id);
    if (!bounds) {
      throw new Error("unable to find bounds");
    }

    return {
      x: bounds.left + x,
      y: bounds.top + y
    };
  }

  // consider speeding this up by using array
  function getCurrentDropId(startId: string, x: number, y: number) {
    let current = null;

    const { x: fx, y: fy } = getFixedPosition(startId, x, y);

    refs.current.forEach((bounds, key) => {
      if (
        fx > bounds.left &&
        fx < bounds.right &&
        fy > bounds.top &&
        fy < bounds.bottom
      ) {
        current = key;
      }
    });

    return current;
  }

  return (
    <DragContext.Provider
      value={{
        register,
        remove,
        getCurrentDropId
      }}
    >
      {children}
    </DragContext.Provider>
  );
}
