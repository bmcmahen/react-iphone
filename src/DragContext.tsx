import * as React from "react";
import { Bounds } from "./hooks/use-measure";
import { getIndexFromCoordinates, getPositionForIndex } from "./IconGrid";

interface DragContextType {
  register: (id: string, bounds: Bounds, length: number) => void;
  remove: (id: string) => void;
  placeholder: PlaceholderState | null;
  hidePlaceholder: () => void;
  getCurrentDropId: (id: string, x: number, y: number) => string | null;
  showPlaceholder: (
    sourceId: string,
    targetId: string,
    x: number,
    y: number,
    sourceIndex: number
  ) => void;
  onSwitchTargets: (placeholder: PlaceholderState) => void;
}

export const DragContext = React.createContext<DragContextType>({
  register: (id: string, bounds: any) => {},
  remove: (id: string) => {},
  hidePlaceholder: () => {},
  placeholder: null,
  getCurrentDropId: (id: string, x: number, y: number): string | null => {
    return null;
  },
  showPlaceholder: (
    id: string,
    targetId: string,
    x: number,
    y: number,
    sourceIndex: number
  ) => {},
  onSwitchTargets: (placeholder: PlaceholderState) => {}
});

interface Props {
  children: React.ReactNode;
  onChange?: (placeholder: PlaceholderState) => void;
}

export interface PlaceholderState {
  // sourceIndex: number;
  sourceId: string;
  targetId: string;
  x: number;
  y: number;
  rx: number; // relative position of final target
  ry: number;
  sourceIndex: number;
  targetIndex: number;
}

interface DroppableState extends Bounds {
  length: number;
}

export function DragContextProvider({ children, onChange }: Props) {
  const [placeholder, setPlaceholder] = React.useState<PlaceholderState | null>(
    null
  );
  const refs = React.useRef<Map<string, DroppableState>>(new Map());

  function register(id: string, bounds: any, length: number) {
    refs.current.set(id, {
      bottom: bounds.bottom,
      height: bounds.height,
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
      width: bounds.width,
      length
    });

    console.log(refs.current);
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

  function hidePlaceholder() {
    setPlaceholder(null);
  }

  function diffDropzones(sourceId: string, targetId: string) {
    const sBounds = refs.current.get(sourceId)!;
    const tBounds = refs.current.get(targetId)!;

    return {
      x: tBounds.left - sBounds.left,
      y: tBounds.top - sBounds.top
    };
  }

  function showPlaceholder(
    sourceId: string,
    targetId: string,
    x: number,
    y: number,
    sourceIndex: number
  ) {
    // placeholder should contain our
    // - sourceId
    // - targetIndex
    // this way, the source icongrid can monitor if
    // it should animate the current item to the target
    // id, and then after the animation has finished,
    // tell the context to actually replace the item.

    const { x: fx, y: fy } = getFixedPosition(sourceId, x, y);
    const { x: rx, y: ry } = getRelativePosition(targetId, fx, fy);
    let index = getIndexFromCoordinates(rx, ry);
    const { length } = refs.current.get(targetId)!;

    if (index >= length) {
      index = length;
    }

    const {
      xy: [px, py]
    } = getPositionForIndex(index, null);

    const { x: dx, y: dy } = diffDropzones(sourceId, targetId);

    const relativePosition = {
      rx: px + dx,
      ry: py + dy
    };

    setPlaceholder({
      sourceId,
      targetId,
      x: rx,
      y: ry,
      ...relativePosition,
      sourceIndex,
      targetIndex: index
    });
  }

  function getFixedPosition(id: string, x: number, y: number) {
    const bounds = refs.current.get(id);
    if (!bounds) {
      throw new Error("unable to find bounds");
    }

    console.log("bounds", bounds);

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

  function onSwitchTargets(placeholder: PlaceholderState) {
    console.log("switch targets", placeholder);
    setPlaceholder(null);

    if (onChange) {
      onChange(placeholder);
    }
  }

  return (
    <DragContext.Provider
      value={{
        register,
        showPlaceholder,
        hidePlaceholder,
        remove,
        getCurrentDropId,
        placeholder,
        onSwitchTargets
      }}
    >
      {children}
    </DragContext.Provider>
  );
}
