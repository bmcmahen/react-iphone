import * as React from "react";
import { Bounds } from "./hooks/use-measure";

interface DragContextType {
  register: (id: string, bounds: Bounds) => void;
  remove: (id: string) => void;
  placeholder: PlaceholderState | null;
  getCurrentDropId: (id: string, x: number, y: number) => string | null;
  showPlaceholder: (
    sourceId: string,
    targetId: string,
    x: number,
    y: number
  ) => void;
}

export const DragContext = React.createContext<DragContextType>({
  register: (id: string, bounds: any) => {},
  remove: (id: string) => {},
  placeholder: null,
  getCurrentDropId: (id: string, x: number, y: number): string | null => {
    return null;
  },
  showPlaceholder: (id: string, targetId: string, x: number, y: number) => {}
});

interface Props {
  children: React.ReactNode;
}

interface PlaceholderState {
  id: string;
  x: number;
  y: number;
}

export function DragContextProvider({ children }: Props) {
  const [placeholder, setPlaceholder] = React.useState<PlaceholderState | null>(
    null
  );
  const refs = React.useRef<Map<string, Bounds>>(new Map());

  function register(id: string, bounds: any) {
    refs.current.set(id, bounds);
  }

  // takes a fix position and returns a relative position in relation
  // to the provided target
  function getRelativePosition(targetId: string, x: number, y: number) {
    const bounds = refs.current.get(targetId);
    if (!bounds) throw new Error("unable to find bounds");
    return {
      x: x - bounds.left,
      y: y - bounds.top
    };
  }

  function remove(id: string) {
    refs.current.delete(id);
  }

  function showPlaceholder(
    sourceId: string,
    targetId: string,
    x: number,
    y: number
  ) {
    const { x: fx, y: fy } = getFixedPosition(sourceId, x, y);
    setPlaceholder({
      id: targetId,
      ...getRelativePosition(targetId, fx, fy)
    });
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
        showPlaceholder,
        remove,
        getCurrentDropId,
        placeholder
      }}
    >
      {children}
    </DragContext.Provider>
  );
}
