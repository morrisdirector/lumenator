import { FunctionalComponent, h, render } from "preact";

import { IToggleSwitchProps } from "./IToggleSwitchProps";

const ToggleSwitch: FunctionalComponent<IToggleSwitchProps> = (props) => {
  const renderStateClass = (): string => {
    if (props.on !== undefined) {
      return !!props.on ? "ON" : "OFF";
    }
    return "OFF";
  };

  return (
    <div
      class={"lum-ToggleSwitch " + renderStateClass()}
      ontouchstart="return true;"
      onClick={() => {
        if (typeof props.onClick === "function") {
          props.onClick(!props.on);
        }
      }}
    >
      <div class="circle"></div>
    </div>
  );
};

export default ToggleSwitch;
