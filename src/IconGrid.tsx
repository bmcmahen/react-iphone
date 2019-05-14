import * as React from "react";
import { useSprings, animated, interpolate, SpringValue } from "react-spring";
import {
  useGestureResponder,
  CallbackType,
  StateType
} from "react-gesture-responder";
import clamp from "lodash-es/clamp";
import swap from "./move";
import weather from "./Icons/Weather.svg";
import wallet from "./Icons/Wallet.svg";
import settings from "./Icons/Settings.svg";
import messages from "./Icons/Messages.svg";
import reminders from "./Icons/Reminders.svg";
import { Icon as IOSIcon } from "./Icons/Icon";
import findIndex from "lodash-es/findIndex";
import { useMeasure } from "./hooks/use-measure";
import { DragContext } from "./DragContext";

interface ItemType {
  name: string;
  icon: any;
  hide?: boolean;
}

const griditems: Array<ItemType> = [
  {
    name: "Ben",
    icon: <IOSIcon name="Weather" path={weather} />
  },
  {
    name: "Joe",
    icon: <IOSIcon name="Wallet" path={wallet} />
  },
  {
    name: "Ken",
    icon: <IOSIcon name="Settings" path={settings} />
  },
  {
    name: "Rod",
    icon: <IOSIcon name="Messages" path={messages} />
  },
  {
    name: "Bob",
    icon: <IOSIcon name="Reminders" path={reminders} />
  }
];

interface StyleProps {
  [x: string]: SpringValue<any>;
  xy: SpringValue<number[]>;
  width: SpringValue<number>;
  height: SpringValue<number>;
  zIndex: SpringValue<string>;
  scale: SpringValue<number>;
  opacity: SpringValue<number>;
}

interface IconGridProps {
  items?: Array<ItemType>;
  style?: any;
  id: string;
}

export function IconGrid({
  id,
  items = griditems,
  style,
  ...other
}: IconGridProps) {
  const {
    register,
    remove,
    getCurrentDropId,
    onSwitchTargets,
    hidePlaceholder,
    placeholder,
    showPlaceholder
  } = React.useContext(DragContext);
  const ref = React.useRef<HTMLDivElement>(null);
  const { bounds } = useMeasure(ref);

  const order = React.useRef(griditems.map((_, i) => i));

  const itemList = items;

  const placeholderIndex = getPlaceholderIndex();

  function getPlaceholderIndex() {
    if (placeholder && placeholder.targetId === id) {
      const i = getIndexFromCoordinates(placeholder.x, placeholder.y);
      return i;
    }
    return null;
  }

  const [springs, setSprings] = useSprings(
    itemList.length,
    positions(order.current, placeholderIndex)
  );

  React.useEffect(() => {
    register(id, bounds);
  }, [bounds, id]);

  React.useEffect(() => {
    return () => remove(id);
  }, [id]);

  React.useEffect(() => {
    setSprings(positions(order.current, placeholderIndex));
  }, [placeholderIndex, order.current, setSprings]);

  return (
    <div
      ref={ref}
      style={{
        // padding: "0.75rem",
        // paddingTop: "50px",
        boxSizing: "border-box",
        height: "100%",
        ...style
      }}
      {...other}
    >
      {springs.map((styles: StyleProps, i: number) => {
        /**
         * Handle dragging
         */

        function handleMove(state: StateType, down: boolean) {
          // 1. get active droppable

          // 2. get the target index for that droppable

          // 3. if down,
          // - update our drag position
          // - insert item (or placeholder?) at index of target list

          // 4. on release
          // - remove item from previous list

          const curIndex = order.current.indexOf(i);

          const startPosition = getDragPosition(
            curIndex,
            state.delta[0],
            state.delta[1],
            true
          );

          const targetDropId = getCurrentDropId(
            id,
            startPosition.xy[0],
            startPosition.xy[1]
          );

          if (targetDropId !== id && targetDropId) {
            showPlaceholder(
              id,
              targetDropId,
              startPosition.xy[0],
              startPosition.xy[1],
              curIndex
            );
          } else {
            hidePlaceholder();
          }

          // need to be able to manipulate the other iconGrid from this position.

          // if targetDropId !== thisDropId
          // we need to tell render a placeholder element on the target
          // id. On drop, we remove this grid item, and add one to the other.

          const targetIndex = clamp(
            getTargetIndex(curIndex, state.delta[0], state.delta[1]),
            items.length - 1
          );

          const newOrder = swap(
            order.current,
            curIndex,
            targetIndex
          ) as number[];

          setSprings(
            positions(
              newOrder,
              placeholderIndex,
              down,
              i,
              curIndex,
              state.delta
            )
          );

          if (!down) {
            order.current = newOrder;
          }
        }

        /**
         * Handle releases
         */

        function onEnd(state: StateType) {
          handleMove(state, false);

          if (placeholder && placeholder.sourceId === id) {
            setSprings(
              positionsWithDrop(order.current, placeholder, onSwitchTargets)
            );
          }
        }

        function onMove(state: StateType) {
          handleMove(state, true);
        }

        return (
          <Icon
            key={itemList[i].name}
            item={itemList[i]}
            styles={styles}
            onMove={onMove}
            onEnd={onEnd}
          />
        );
      })}
    </div>
  );
}

interface ItemProps {
  item: ItemType;
  styles: StyleProps;
  onMove: CallbackType;
  onEnd: (state: StateType) => void;
}

function Icon({ styles, item: { name, icon }, onMove, onEnd }: ItemProps) {
  const dragging = React.useRef(false);

  const { bind } = useGestureResponder(
    {
      onMoveShouldSet: () => {
        // should only be true once long press triggers edit
        dragging.current = true;
        return true;
      },
      onMove: onMove,
      onTerminationRequest: () => {
        // once we are dragging, prevent other responders
        // from taking over
        if (dragging.current) {
          return false;
        }

        return true;
      },
      onTerminate: (state, e) => {
        dragging.current = false;
        onEnd(state);
      },
      onRelease: (state, e) => {
        dragging.current = false;
        onEnd(state);
      }
    },
    {
      enableMouse: true
    }
  );

  return (
    <animated.div
      {...bind}
      style={{
        padding: "0.75rem",
        width: styles.width,
        height: styles.height,
        zIndex: styles.zIndex,
        opacity: styles.opacity,
        boxSizing: "border-box",
        position: "absolute",
        transform: interpolate(
          [styles.xy, styles.scale],
          (x: any, s) => `translate3d(${x[0]}px, ${x[1]}px, 0) scale(${s})`
        )
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          width: "100%",
          height: "100%"
        }}
      >
        {icon}
      </div>
    </animated.div>
  );
}

// potentially make these things dynamic by actually
// measuring stuff and keeping it in state
const containerWidth = 375;
const bpr = 4;
const rh = 100; // row height
const cw = containerWidth / bpr; // column width

interface PlaceholderState {
  sourceId: string;
  targetId: string;
  x: number;
  y: number;
  sourceIndex: number;
  rx: number; // relative position of final target
  ry: number;
}

function positionsWithDrop(
  order: number[],
  placeholder: PlaceholderState,
  onRemove: Function
) {
  return (i: number) => {
    const isSourceIndex = placeholder && placeholder.sourceIndex === i;

    const shared = {
      immediate: false,
      zIndex: "0",
      scale: 1,
      opacity: 1
    };

    if (isSourceIndex) {
      return {
        ...shared,
        xy: [placeholder.rx, placeholder.ry],
        width: cw,
        height: rh,
        onRest: () => {
          onRemove(placeholder);
        }
      };
    }

    return {
      ...getPositionForIndex(i >= placeholder.sourceIndex ? i - 1 : i, null),
      immediate: false,
      zIndex: "0",
      scale: 1,
      opacity: 1
    };
  };
}

function positions(
  order: number[],
  placeholderIndex: number | null,
  down?: boolean,
  originalIndex?: number,
  curIndex?: number,
  delta?: [number, number]
) {
  return (i: number) => {
    const pos =
      down && i === originalIndex
        ? {
            ...getDragPosition(curIndex!, delta![0], delta![1]),
            immediate: true,
            zIndex: "2000",
            scale: 1.1,
            opacity: 0.8
          }
        : {
            ...getPositionForIndex(order.indexOf(i), placeholderIndex),
            immediate: false,
            zIndex: "0",
            scale: 1,
            opacity: 1
          };

    return pos;
  };
}

export function getPositionForIndex(
  i: number,
  placeholderIndex: number | null
) {
  const index =
    placeholderIndex != null ? (i >= placeholderIndex ? i + 1 : i) : i;
  const left = (index % bpr) * cw;
  const top = Math.floor(index / bpr) * rh;
  return {
    xy: [left, top],
    width: cw,
    height: rh
  };
}

function getDragPosition(
  startIndex: number,
  dx: number,
  dy: number,
  center: boolean = false
) {
  // get starting position
  const {
    xy: [left, top],
    width,
    height
  } = getPositionForIndex(startIndex, null);

  // get current position by adding dy / dx to
  // the starting position
  return {
    xy: [
      left + dx + (center ? width / 2 : 0),
      top + dy + (center ? height / 2 : 0)
    ],
    width,
    height
  };
}

function getTargetIndex(startIndex: number, dx: number, dy: number) {
  const {
    xy: [cx, cy]
  } = getDragPosition(startIndex, dx, dy, true);

  // get the target index
  return getIndexFromCoordinates(cx, cy);
}

export function getIndexFromCoordinates(x: number, y: number) {
  return Math.floor(y / rh) * bpr + Math.floor(x / cw);
}
