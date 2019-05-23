import * as React from "react";
import "./About.css";
import { Text, Button, IconArrowRight, Link, IconZoomIn } from "sancho";

export function AboutTitle({
  setFullScreen
}: {
  setFullScreen: (value: boolean) => void;
}) {
  return (
    <div className="AboutTitle">
      <Text variant="display3">React Gesture Responder</Text>
      <Text className="lead" gutter variant="lead">
        React-gesture-responder is a responder system for your react application
        which allows you to build complex gesture based interfaces.
      </Text>
      <Button
        component="a"
        href="https://github.com/bmcmahen/react-gesture-responder"
        intent="primary"
        size="md"
        variant="ghost"
        iconAfter={<IconArrowRight />}
      >
        Learn more on GitHub
      </Button>
      <div className="About__divider">
        <Button
          className="Index__Button-fullscreen"
          onPress={() => setFullScreen(true)}
          variant="ghost"
          intent="primary"
          iconAfter={<IconZoomIn />}
        >
          Toggle fullscreen example
        </Button>
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="About">
      <Text variant="paragraph" muted>
        Built by <Link href="https://twitter.com/BenMcMahen">Ben McMahen</Link>
        <br />
        You can view this example on{" "}
        <Link href="https://github.com/bmcmahen/react-iphone">GitHub</Link>
      </Text>
    </div>
  );
}
