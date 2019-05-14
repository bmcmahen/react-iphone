import * as React from "react";
import { Bounds } from "../hooks/use-measure";
import { GridSettings } from "./grid-types";

interface RegisterOptions extends Bounds {
  /** The number of documents in each grid */
  count: number;
  /** grid info (boxes per row) */
  grid: GridSettings;
}

/**
 * A traverse captures information about dragging a grid item
 * from one list to another.
 */

interface TraverseType {
  sourceId: string;
  targetId: string;
  rx: number;
  ry: number;
  sourceIndex: number;
  targetIndex: number;
}

interface GridContextType {
  register: (id: string, options: RegisterOptions) => void;
  remove: (id: string) => void;
}

const noop = () => {
  throw new Error(
    "Make sure that you have wrapped your drop zones with GridContext"
  );
};

export const GridContext = React.createContext<GridContextType>({
  register: noop,
  remove: noop
});

interface GridContextProviderProps {
  children: React.ReactNode;
}

export function GridContextProvider({ children }: GridContextProviderProps) {
  const dropRefs = React.useRef<Map<string, RegisterOptions>>(new Map());

  /**
   * Register a drop zone with relevant information
   * @param id
   * @param options
   */

  function register(id: string, options: RegisterOptions) {
    dropRefs.current.set(id, options);
  }

  /**
   * Remove a drop zone (typically on unmount)
   * @param id
   */

  function remove(id: string) {
    dropRefs.current.get(id);
  }

  return (
    <GridContext.Provider
      value={{
        register,
        remove
      }}
    >
      {children}
    </GridContext.Provider>
  );
}
