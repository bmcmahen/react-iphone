import GestureView from "react-gesture-view";
import * as React from "react";
import { StateType, ResponderEvent } from "react-gesture-responder";
import { Pane } from "./Pane";
import { Dots } from "./Dots";
import "./styles.css";
import { Dock } from "./Dock";
import { IconGrid, ItemType } from "./IconGrid";
import { Status } from "./Status";
import { DragContextProvider, PlaceholderState } from "./DragContext";
import { Icon as IOSIcon } from "./Icons/Icon";
import settings from "./Icons/Settings.svg";
import messages from "./Icons/Messages.svg";
import reminders from "./Icons/Reminders.svg";
import weather from "./Icons/Weather.svg";
import wallet from "./Icons/Wallet.svg";

const move = (
  source: Array<ItemType>,
  destination: Array<ItemType>,
  droppableSource: number,
  droppableDestination: number
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  console.log("s, d", sourceClone, destClone);

  const [removed] = sourceClone.splice(droppableSource, 1);

  destClone.splice(droppableDestination, 0, removed);

  return [sourceClone, destClone];
};

export function IOS() {
  const [childIndex, setChildIndex] = React.useState(0);
  const [parentIndex, setParentIndex] = React.useState(1);

  const [dock, setDock] = React.useState([
    {
      name: "yaahhh",
      icon: <IOSIcon iconOnly name="Settings" path={settings} />
    },
    {
      name: "rdfsad",
      icon: <IOSIcon iconOnly name="Messages" path={messages} />
    },
    {
      name: "Kesadfasdfdasfasdfn",
      icon: <IOSIcon iconOnly name="Reminders" path={reminders} />
    }
  ]);

  const [pane, setPane] = React.useState([
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
  ]);

  function onMoveShouldSetParent(
    state: StateType,
    _e: ResponderEvent,
    suggested: boolean
  ) {
    if (suggested) {
      if (parentIndex === 0 || (state.delta[0] > 0 && childIndex === 0)) {
        console.log("set parent");
        return true;
      }
    }

    return false;
  }

  function onTerminationRequestParent(state: StateType) {
    if (state.delta[0] > 0 && childIndex === 0) {
      return false;
    }

    return true;
  }

  function onSwap({
    sourceId,
    sourceIndex,
    targetId,
    targetIndex
  }: PlaceholderState) {
    console.log(sourceId);
    if (sourceId === "icons1") {
      const [p, d] = move(pane, dock, sourceIndex, targetIndex);
      setDock(d);
      setPane(p);
    } else {
      const [d, p] = move(dock, pane, sourceIndex, targetIndex);
      setDock(d);
      setPane(p);
    }
  }

  return (
    <div className="IOS" style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          boxSizing: "border-box",
          top: 0,
          padding: "1.35rem"
        }}
      >
        <Status />
      </div>
      <DragContextProvider onChange={onSwap}>
        <GestureView
          className="Gesture__parent"
          enableMouse
          value={parentIndex}
          id="parent"
          onRequestChange={i => setParentIndex(i)}
          onMoveShouldSet={onMoveShouldSetParent}
          onTerminationRequest={onTerminationRequestParent}
        >
          <Pane>widget crap</Pane>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >
            <GestureView
              className="Gesture__apps"
              id="child"
              enableMouse
              value={childIndex}
              onRequestChange={i => setChildIndex(i)}
            >
              <Pane>
                <IconGrid items={pane} id="icons1" />
              </Pane>
              <Pane>2</Pane>
              <Pane>3</Pane>
            </GestureView>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0
              }}
            >
              <Dots count={3} activeIndex={childIndex} />
              <Dock items={dock} />
            </div>
          </div>
        </GestureView>
      </DragContextProvider>
    </div>
  );
}
