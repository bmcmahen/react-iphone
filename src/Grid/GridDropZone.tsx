import * as React from "react";
import { useSprings } from "react-spring";
import { StateType } from "react-gesture-responder";
import { useMeasure } from "../hooks/use-measure";
import { GridContext } from "./GridContext";
import { GridSettings, ChildRender } from "./grid-types";
import { GridItem } from "./GridItem";

type GridDropZoneProps<T> = {
  items: T[];
  boxesPerRow: number;
  rowHeight: number;
  id: string;
  children: ChildRender<T>;
};

export function GridDropZone<T>({
  items,
  id,
  boxesPerRow,
  children,
  rowHeight,
  ...other
}: GridDropZoneProps<T>) {
  const { register, remove } = React.useContext(GridContext);
  const ref = React.useRef<HTMLDivElement>(null);
  const { bounds } = useMeasure(ref);
  const order = React.useRef(items.map((_, i) => i));

  const grid: GridSettings = {
    columnWidth: bounds.width / boxesPerRow,
    boxesPerRow,
    rowHeight
  };

  const [springs, setSprings] = useSprings(
    items.length,
    getFinalPositions(grid)
  );

  /**
   * Register our dropzone with our grid context
   */

  React.useEffect(() => {
    register(id, {
      top: bounds.top,
      bottom: bounds.bottom,
      left: bounds.left,
      right: bounds.right,
      width: bounds.width,
      height: bounds.height,
      count: items.length,
      grid
    });
  }, [items, bounds, id, grid]);

  /**
   * Unregister when unmounting
   */

  React.useEffect(() => {
    return () => remove(id);
  }, [id]);

  /**
   * Maintain updated order whenever our list
   * of items changes
   */

  React.useEffect(() => {
    order.current = items.map((_, i) => i);
  }, [order, items]);

  return (
    <div ref={ref} {...other}>
      {springs.map((styles, i) => {
        /**
         * Handle dragging
         */

        function onMove(state: StateType) {
          const startIndex = order.current.indexOf(i);

          // set springs
        }

        /**
         * Handle release
         * @param state
         */

        function onEnd(state: StateType) {
          console.log("on end");
        }

        return (
          <GridItem
            key={i}
            i={i}
            width={grid.columnWidth}
            height={rowHeight}
            item={items[i]}
            styles={styles}
            onMove={onMove}
            onEnd={onEnd}
          >
            {children}
          </GridItem>
        );
      })}
    </div>
  );
}

/**
 * Get the relative top, left position for a particular
 * index in a grid
 * @param i
 * @param grid
 * @param traverseIndex (destination for traverse)
 */

function getPositionForIndex(
  i: number,
  { boxesPerRow, rowHeight, columnWidth }: GridSettings,
  traverseIndex?: number
) {
  const index = traverseIndex ? (i >= traverseIndex ? i + 1 : i) : i;
  const x = (index % boxesPerRow) * columnWidth;
  const y = Math.floor(index / boxesPerRow) * rowHeight;
  return {
    xy: [x, y]
  };
}

/**
 * Determine final animation state independently of dragging
 * @param grid
 */

function getFinalPositions(grid: GridSettings) {
  return (i: number) => ({
    ...getPositionForIndex(i, grid),
    immediate: false,
    reset: true,
    zIndex: "0",
    scale: 1,
    opacity: 1
  });
}
