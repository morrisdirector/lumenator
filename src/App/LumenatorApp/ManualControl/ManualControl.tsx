import * as iro from "@jaames/iro";

import { FunctionalComponent, h } from "preact";

import { ControlMode } from "../../../lib/enums/ControlMode";
import { IManualControlProps } from "./IManualControlProps";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
import { useLayoutEffect } from "preact/hooks";

const ManualControl: FunctionalComponent<IManualControlProps> = (props) => {
  const kelvinMin = 4000;
  const kelvinMax = 9000;

  useLayoutEffect(() => {
    const rgbColorPicker = iro.default.ColorPicker("#rgb-color-picker", {
      borderWidth: 2,
      layout: [
        {
          component: iro.default.ui.Wheel,
          options: {
            borderColor: "#d1d1d1",
          },
        },
        {
          component: iro.default.ui.Slider,
          options: {
            borderColor: "#d1d1d1",
            sliderType: "value",
          },
        },
      ],
    });
    const whiteColorPicker = iro.default.ColorPicker("#white-color-picker", {
      borderWidth: 2,
      layout: [
        {
          component: iro.default.ui.Slider,
          options: {
            borderColor: "#d1d1d1",
            minTemperature: kelvinMin,
            maxTemperature: kelvinMax,
            sliderType: "kelvin",
            sliderShape: "circle",
          },
        },
      ],
    });
    const whiteValuePicker = iro.default.ColorPicker("#white-value-picker", {
      borderWidth: 2,
      layout: [
        {
          component: iro.default.ui.Slider,
          options: {
            borderColor: "#d1d1d1",
            sliderType: "value",
          },
        },
      ],
    });
    rgbColorPicker.on("color:change", (color) => {
      handleControlModeToggle(ControlMode.RGB);
      console.log(color);
    });
    whiteColorPicker.on("color:change", (color) => {
      handleControlModeToggle(ControlMode.WHITE);
      console.log(color);
    });
    whiteValuePicker.on("color:change", (color) => {
      handleControlModeToggle(ControlMode.WHITE);
      console.log(color);
    });
  }, []);

  const handleControlModeToggle = (modeSwitch: ControlMode): void => {
    if (typeof props.onControlModeToggle === "function") {
      if (props.controlMode === modeSwitch) {
        // Toggling off:
        props.onControlModeToggle(ControlMode.STANDBY);
      } else {
        // Toggling on:
        props.onControlModeToggle(modeSwitch);
      }
    }
  };

  return (
    <section>
      <div class="grid-large">
        <div class="form-group no-margin">
          <label for="modeRgb">RGB Mode</label>
          <ToggleSwitch
            on={props.controlMode === ControlMode.RGB}
            onClick={() => {
              handleControlModeToggle(ControlMode.RGB);
            }}
          ></ToggleSwitch>
          <div class="color-picker">
            <div id="rgb-color-picker"></div>
          </div>
          {/* <alert-message id="rgb-warning" icon="info"></alert-message> */}
        </div>
        <div class="form-group no-margin">
          <label for="modeWhite">White Mode</label>
          <ToggleSwitch
            on={props.controlMode === ControlMode.WHITE}
            onClick={() => {
              handleControlModeToggle(ControlMode.WHITE);
            }}
          ></ToggleSwitch>
          <div class="color-picker">
            <div id="white-color-picker"></div>
            <div id="white-value-picker"></div>
          </div>
          {/* <alert-message id="white-warning" icon="info"></alert-message> */}
        </div>
      </div>
    </section>
  );
};

export default ManualControl;
