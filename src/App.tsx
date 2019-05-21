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
import cx from "classnames";
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
  const [draggingApp, setDraggingApp] = React.useState(false);
  const [isEditingApps, setIsEditingApps] = React.useState(false);

  function editApps() {
    setIsEditingApps(true);
  }

  const [apps, setApps] = React.useState<AppState>({
    dock: [
      {
        name: "Settings",
        icon: (
          <IOSIcon
            onLongPress={editApps}
            isEditing={isEditingApps}
            iconOnly
            name="Settings"
            path={settings}
          />
        )
      },
      {
        name: "Messages",
        icon: (
          <IOSIcon
            onLongPress={editApps}
            isEditing={isEditingApps}
            iconOnly
            name="Messages"
            path={messages}
          />
        )
      },
      {
        name: "Reminders",
        icon: (
          <IOSIcon
            onLongPress={editApps}
            isEditing={isEditingApps}
            iconOnly
            name="Reminders"
            path={reminders}
          />
        )
      }
    ],
    pane1: [
      {
        name: "Weather",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Weather"
            path={weather}
          />
        )
      },
      {
        name: "Wallet",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Wallet"
            path={wallet}
          />
        )
      }
    ],
    pane2: [
      {
        name: "Whatever",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Settings"
            path={settings}
          />
        )
      },
      {
        name: "Idunno",
        icon: (
          <IOSIcon
            onLongPress={editApps}
            iconOnly
            name="Messages"
            isEditing={isEditingApps}
            path={messages}
          />
        )
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

  function endEditing() {
    setIsEditingApps(false);
  }

  return (
    <div
      className={cx("IOS", {
        "IOS--editing": isEditingApps
      })}
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          boxSizing: "border-box",
          top: 0,
          zIndex: 10,
          padding: "1.35rem 1.75rem"
        }}
      >
        <Status isEditingApps={isEditingApps} endEditing={endEditing} />
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
            onMouseDown={() => {
              setDraggingApp(true);
            }}
            onMouseUp={() => {
              setDraggingApp(false);
            }}
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
                      <GridDropZone
                        disableDrag={!isEditingApps}
                        boxesPerRow={4}
                        rowHeight={105}
                        id={key}
                      >
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
              onMouseDown={e => {
                e.stopPropagation();
              }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: draggingApp ? -1 : 0
              }}
            >
              <Dots
                count={Object.keys(apps).length - 1}
                activeIndex={childIndex}
              />
              <Dock
                disableDrag={!isEditingApps}
                draggingApp={draggingApp}
                items={apps.dock}
              />
            </div>
          </div>
        </GestureView>
      </GridContextProvider>
    </div>
  );
}
