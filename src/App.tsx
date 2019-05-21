import GestureView from "react-gesture-view";
import * as React from "react";
import { StateType, ResponderEvent } from "react-gesture-responder";
import { Pane } from "./Pane";
import { Dots } from "./Dots";
import "./styles.css";
import { Dock } from "./Dock";
import { Status } from "./Status";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  move,
  swap
} from "react-grid-dnd";
import { Icon as IOSIcon } from "./Icons/Icon";
import settings from "./Icons/Settings.svg";
import messages from "./Icons/Messages.svg";
import reminders from "./Icons/Reminders.svg";
import weather from "./Icons/Weather.svg";
import wallet from "./Icons/Wallet.svg";

interface AppState {
  [key: string]: Array<{
    name: string;
    icon: React.ReactNode;
  }>;
}

export function IOS() {
  const [childIndex, setChildIndex] = React.useState(0);
  const [parentIndex, setParentIndex] = React.useState(1);

  const [apps, setApps] = React.useState<AppState>({
    dock: [
      {
        name: "Settings",
        icon: <IOSIcon iconOnly name="Settings" path={settings} />
      },
      {
        name: "Messages",
        icon: <IOSIcon iconOnly name="Messages" path={messages} />
      },
      {
        name: "Reminders",
        icon: <IOSIcon iconOnly name="Reminders" path={reminders} />
      }
    ],
    pane1: [
      {
        name: "Weather",
        icon: <IOSIcon name="Weather" path={weather} />
      },
      {
        name: "Wallet",
        icon: <IOSIcon name="Wallet" path={wallet} />
      }
    ],
    pane2: [
      {
        name: "Whatever",
        icon: <IOSIcon name="Settings" path={settings} />
      },
      {
        name: "Idunno",
        icon: <IOSIcon iconOnly name="Messages" path={messages} />
      }
    ]
  });

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

  function onSwap(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
    targetId?: string
  ) {
    if (targetId) {
      const result = move(
        apps[sourceId],
        apps[targetId],
        sourceIndex,
        targetIndex
      );

      return setApps({
        ...apps,
        [sourceId]: result[0],
        [targetId]: result[1]
      });
    }

    const result = swap(apps[sourceId], sourceIndex, targetIndex);
    return setApps({
      ...apps,
      [sourceId]: result
    });
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
      <GridContextProvider onChange={onSwap}>
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
              {Object.keys(apps)
                .filter(key => key !== "dock")
                .map(key => {
                  return (
                    <Pane key={key}>
                      <GridDropZone boxesPerRow={4} rowHeight={80} id={key}>
                        {apps[key].map(app => (
                          <GridItem key={app.name}>
                            {React.cloneElement(app.icon as any, {
                              iconOnly: false
                            })}
                          </GridItem>
                        ))}
                      </GridDropZone>
                    </Pane>
                  );
                })}
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
              <Dock items={apps.dock} />
            </div>
          </div>
        </GestureView>
      </GridContextProvider>
    </div>
  );
}
