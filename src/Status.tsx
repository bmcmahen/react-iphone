import * as React from "react";
import "./Status.css";
import { useTransition, animated } from "react-spring";

export function formatAMPM() {
  const date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const min = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + min + " " + ampm;
  return strTime;
}

interface Props {
  isEditingApps: boolean;
  endEditing: () => void;
}

export const Status = ({ isEditingApps, endEditing }: Props) => {
  const [time, setTime] = React.useState(formatAMPM());
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatAMPM());
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const transitions = useTransition(isEditingApps, null, {
    from: { transform: "scale(0)" },
    enter: { transform: "scale(1)" },
    leave: { transform: "scale(0)" }
  });

  const opacity = useTransition(!isEditingApps, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    <div className="Status">
      {transitions.map(({ item, key, props }) => {
        return (
          item && (
            <div
              key={key}
              style={{
                position: "absolute",
                right: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                height: "14px"
              }}
            >
              <animated.button
                style={props}
                className="Status__done"
                onClick={endEditing}
              >
                Done
              </animated.button>
            </div>
          )
        );
      })}
      {opacity.map(
        ({ item, key, props }) =>
          item && (
            <animated.svg
              key={key}
              style={props}
              width="100%"
              height="14px"
              viewBox="0 0 326 14"
              version="1.1"
            >
              <defs />
              <g
                id="Page-1"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="Bars/Status/White"
                  transform="translate(-35.000000, -67.000000)"
                >
                  <g
                    id="iPhone-X/Status-Bars/Status-Bar-(White)"
                    transform="translate(0.000000, 50.000000)"
                  >
                    <g id="iPhone-X/Status-Bars/Status-Bar-(Black)">
                      <rect
                        id="Rectangle"
                        x="0"
                        y="0"
                        width="375"
                        height="44"
                      />
                      <g
                        id="Battery"
                        transform="translate(336.000000, 17.000000)"
                      >
                        <rect
                          id="Border"
                          stroke="#FFFFFF"
                          opacity="0.35"
                          x="0.5"
                          y="0.833333333"
                          width="21"
                          height="10.3333333"
                          rx="2.66666675"
                        />
                        <path
                          d="M23,4 L23,8 C23.8047311,7.66122348 24.328038,6.87313328 24.328038,6 C24.328038,5.12686672 23.8047311,4.33877652 23,4"
                          id="Cap"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                          opacity="0.4"
                        />
                        <rect
                          id="Capacity"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                          x="2"
                          y="2.33333333"
                          width="18"
                          height="7.33333333"
                          rx="1.33333337"
                        />
                      </g>
                      <path
                        d="M323.330333,19.608 C325.546226,19.6080971 327.677386,20.4595347 329.283333,21.9863333 C329.404265,22.1042079 329.597562,22.102721 329.716667,21.983 L330.872667,20.8163333 C330.932975,20.7556112 330.966599,20.6733595 330.966098,20.5877792 C330.965598,20.5021988 330.931014,20.420346 330.87,20.3603333 C326.654902,16.3207858 320.005098,16.3207858 315.79,20.3603333 C315.728941,20.4203015 315.694297,20.5021294 315.693734,20.5877099 C315.693171,20.6732903 315.726736,20.755567 315.787,20.8163333 L316.943333,21.983 C317.062362,22.1029017 317.255808,22.1043897 317.376667,21.9863333 C318.982819,20.4594344 321.114223,19.6079944 323.330333,19.608 Z M323.330333,23.4036667 C324.547823,23.4035921 325.721865,23.8561245 326.624333,24.6733333 C326.746397,24.7893139 326.938678,24.7867994 327.057667,24.6676667 L328.212333,23.501 C328.273141,23.439805 328.30688,23.3567887 328.306003,23.2705239 C328.305126,23.1842592 328.269706,23.101946 328.207667,23.042 C325.459468,20.4856177 321.203532,20.4856177 318.455333,23.042 C318.393256,23.1019453 318.357837,23.1842997 318.357023,23.2705923 C318.356208,23.356885 318.390065,23.4398934 318.451,23.501 L319.605333,24.6676667 C319.724322,24.7867994 319.916603,24.7893139 320.038667,24.6733333 C320.940539,23.8566645 322.113649,23.4041708 323.330333,23.4036667 Z M325.549333,26.188 C325.611087,26.127394 325.645095,26.0439919 325.643328,25.957485 C325.641561,25.8709782 325.604176,25.7890342 325.54,25.731 C324.264428,24.6521162 322.396238,24.6521162 321.120667,25.731 C321.056446,25.7889875 321.019,25.8709057 321.01717,25.957413 C321.01534,26.0439203 321.049289,26.1273487 321.111,26.188 L323.108667,28.2036667 C323.167217,28.2629057 323.247042,28.2962443 323.330333,28.2962443 C323.413624,28.2962443 323.49345,28.2629057 323.552,28.2036667 L325.549333,26.188 Z"
                        id="Wifi"
                        fill="#FFFFFF"
                        fill-rule="nonzero"
                      />
                      <path
                        d="M294.666667,24.3333333 L295.666667,24.3333333 C296.218951,24.3333333 296.666667,24.7810486 296.666667,25.3333333 L296.666667,27.3333333 C296.666667,27.8856181 296.218951,28.3333333 295.666667,28.3333333 L294.666667,28.3333333 C294.114382,28.3333333 293.666667,27.8856181 293.666667,27.3333333 L293.666667,25.3333333 C293.666667,24.7810486 294.114382,24.3333333 294.666667,24.3333333 Z M299.333333,22.3333333 L300.333333,22.3333333 C300.885618,22.3333333 301.333333,22.7810486 301.333333,23.3333333 L301.333333,27.3333333 C301.333333,27.8856181 300.885618,28.3333333 300.333333,28.3333333 L299.333333,28.3333333 C298.781049,28.3333333 298.333333,27.8856181 298.333333,27.3333333 L298.333333,23.3333333 C298.333333,22.7810486 298.781049,22.3333333 299.333333,22.3333333 Z M304,20 L305,20 C305.552285,20 306,20.4477153 306,21 L306,27.3333333 C306,27.8856181 305.552285,28.3333333 305,28.3333333 L304,28.3333333 C303.447715,28.3333333 303,27.8856181 303,27.3333333 L303,21 C303,20.4477153 303.447715,20 304,20 Z M308.666667,17.6666667 L309.666667,17.6666667 C310.218951,17.6666667 310.666667,18.1143819 310.666667,18.6666667 L310.666667,27.3333333 C310.666667,27.8856181 310.218951,28.3333333 309.666667,28.3333333 L308.666667,28.3333333 C308.114382,28.3333333 307.666667,27.8856181 307.666667,27.3333333 L307.666667,18.6666667 C307.666667,18.1143819 308.114382,17.6666667 308.666667,17.6666667 Z"
                        id="Cellular-Connection"
                        fill="#FFFFFF"
                        fill-rule="nonzero"
                      />
                      <g
                        id="iPhone-X/Overrides/Time-White"
                        transform="translate(21.000000, 13.000000)"
                        fill="#FFFFFF"
                        className="Status__text"
                        font-weight="normal"
                        letter-spacing="-0.280000001"
                      >
                        <text id="↳-Time">
                          <tspan x="13.7959766" y="16.5">
                            {time}
                          </tspan>
                        </text>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </animated.svg>
          )
      )}
    </div>
  );
};
