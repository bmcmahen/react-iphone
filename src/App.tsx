import GestureView from "react-gesture-view";
import * as React from "react";
import { StateType, ResponderEvent } from "react-gesture-responder";
import { Pane } from "./Pane";
import { Dots } from "./Dots";
import "./App.css";
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
import safari from "./Icons/Safari.svg";
import phone from "./Icons/Phone.svg";
import notes from "./Icons/Notes.svg";
import news from "./Icons/News.svg";
import calc from "./Icons/Calculator.svg";
import camera from "./Icons/Camera.svg";
import stocks from "./Icons/Stocks.svg";
import photos from "./Icons/Photos.svg";
import facetime from "./Icons/FaceTime.svg";
import home from "./Icons/Home.svg";
import tv from "./Icons/TV.svg";
import books from "./Icons/iBooks.svg";

import { SearchPanel, THRESHOLD } from "./SearchPanel";
import { useSpring, animated } from "react-spring";
import { LeftPane } from "./LeftPane";
import { LockScreen } from "./LockScreen";

interface AppState {
  [key: string]: Array<{
    name: string;
    icon: React.ReactNode;
  }>;
}

interface IOSProps {
  phoneSize: {
    height: number;
    width: number;
  };
}

export function IOS({ phoneSize }: IOSProps) {
  // controls the app icon panels
  const [childIndex, setChildIndex] = React.useState(0);

  // controls the side menu panel
  const [parentIndex, setParentIndex] = React.useState(1);

  // used to get us the right zIndex when dragging app icons to the dock
  const [draggingApp, setDraggingApp] = React.useState(false);

  // when a user has held an icon for an extended duration
  const [isEditingApps, setIsEditingApps] = React.useState(false);

  function editApps() {
    setIsEditingApps(true);
  }

  // our initial app icon state. we could eventually save
  // this to localstorage or something
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
      },
      {
        name: "Phone",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Phone"
            path={phone}
          />
        )
      },
      {
        name: "Safari",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Safari"
            path={safari}
          />
        )
      },
      {
        name: "Notes",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Notes"
            path={notes}
          />
        )
      },
      {
        name: "News",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="News"
            path={news}
          />
        )
      },
      {
        name: "Calculator",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Calculator"
            path={calc}
          />
        )
      },
      {
        name: "Camera",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Camera"
            path={camera}
          />
        )
      },
      {
        name: "Stocks",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Stocks"
            path={stocks}
          />
        )
      },
      {
        name: "Photos",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Photos"
            path={photos}
          />
        )
      },
      {
        name: "FaceTime",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="FaceTime"
            path={facetime}
          />
        )
      }
    ],
    pane2: [
      {
        name: "Home",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="Home"
            path={home}
          />
        )
      },
      {
        name: "TV",
        icon: (
          <IOSIcon
            onLongPress={editApps}
            iconOnly
            name="TV"
            isEditing={isEditingApps}
            path={tv}
          />
        )
      },
      {
        name: "iBooks",
        icon: (
          <IOSIcon
            isEditing={isEditingApps}
            onLongPress={editApps}
            name="iBooks"
            path={books}
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
    // set our parent when swiping left on the first app pane
    if (suggested) {
      if (parentIndex === 0 || (state.delta[0] > 0 && childIndex === 0)) {
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

  // swap app icons from pane to dock
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

  // search spring (triggered when swiping down in app panel)
  const [{ y }, set] = useSpring(() => ({
    y: 0
  }));

  function endEditing() {
    setIsEditingApps(false);
  }

  return (
    <div
      style={{
        height: phoneSize.height + "px",
        width: phoneSize.width + "px"
      }}
      className={cx("IOS", {
        "IOS--editing": isEditingApps
      })}
    >
      <LockScreen
        height={phoneSize.height}
        width={phoneSize.width}
        showLockOnMount
      >
        {/* Status bar * */}
        <div className="IOS__status-container">
          <Status isEditingApps={isEditingApps} endEditing={endEditing} />
        </div>
        {/* Search panel triggered when dragging down */}
        <SearchPanel disable={parentIndex === 0} y={y} set={set}>
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
              {/* Left search pane */}
              <Pane>
                <LeftPane />
              </Pane>

              {/* App icons gesture views. A bit of a hack here to get zIndex working for the dock */}
              <div
                onMouseDown={() => {
                  setDraggingApp(true);
                }}
                onTouchStart={() => {
                  setDraggingApp(true);
                }}
                onMouseUp={() => {
                  setDraggingApp(false);
                }}
                onTouchEnd={() => {
                  setDraggingApp(false);
                }}
                className="IOS__app-icons-container"
              >
                <animated.div
                  className="IOS__app-icons-slide"
                  style={{
                    transform: y.interpolate({
                      range: [0, THRESHOLD],
                      output: ["translateY(0%)", "translateY(7%)"],
                      extrapolate: "clamp"
                    })
                  }}
                >
                  {/* Render a gesture view / dropzone for each pane of icons */}
                  <GestureView
                    className="Gesture__apps"
                    id="child"
                    enableMouse
                    value={childIndex}
                    onRequestChange={i => setChildIndex(i)}
                  >
                    {Object.keys(apps)
                      .filter(key => key !== "dock")
                      .sort()
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
                </animated.div>
                <div
                  className="IOS__app-icons-bottom"
                  onMouseDown={e => {
                    e.stopPropagation();
                  }}
                  style={{
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
        </SearchPanel>
      </LockScreen>
    </div>
  );
}
