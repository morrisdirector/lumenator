import * as iro from "@jaames/iro";

import { FunctionalComponent, h } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { AlertWarningIcon } from "../../../lib/components/AlertWarning/IAlertWarningProps";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { IManualControlProps } from "./IManualControlProps";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const ManualControl: FunctionalComponent<IManualControlProps> = (props) => {
  const kelvinMin = 4000;
  const kelvinMax = 9000;

  const [kelvinValue, setKelvinValue] = useState<number | null>(null);
  const [whiteBrightness, setWhiteBrightness] = useState<number | null>(null);

  useLayoutEffect(() => {
    const rgbColorPicker = iro.default.ColorPicker("#rgb-color-picker", {
      borderWidth: 2,
      color: props.rgbColor || "#FFFFFF",
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
      color: props.whiteColor || "#FFFFFF",
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
      color: props.whiteValueColor || "#FFFFFF",
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

    setKelvinValue(whiteColorPicker.color.kelvin);
    setWhiteBrightness(whiteColorPicker.color.value);

    rgbColorPicker.on("color:change", (color) => {
      handleControlModeToggle(ControlMode.RGB);
      sendRgbColors(color.rgb);
    });
    rgbColorPicker.on("input:end", (color) => {
      if (typeof props.onColorSet === "function") {
        props.onColorSet({ type: "rgb", color: color.rgb });
      }
    });
    whiteColorPicker.on("color:change", (color) => {
      handleControlModeToggle(ControlMode.WHITE);
      sendWhiteLevels({
        kelvin: color.kelvin,
        value: whiteValuePicker.color.value,
      });
      setKelvinValue(color.kelvin);
      setWhiteBrightness(color.value);
    });
    whiteColorPicker.on("input:end", (color) => {
      if (typeof props.onColorSet === "function") {
        props.onColorSet({ type: "white", color: color.rgb });
      }
    });
    whiteValuePicker.on("color:change", (color) => {
      handleControlModeToggle(ControlMode.WHITE);
      sendWhiteLevels({
        kelvin: whiteColorPicker.color.kelvin,
        value: color.value,
      });
      setKelvinValue(color.kelvin);
      setWhiteBrightness(color.value);
    });
    whiteValuePicker.on("input:end", (color) => {
      if (typeof props.onColorSet === "function") {
        props.onColorSet({ type: "whiteValue", color: color.rgb });
      }
    });
  }, []);

  const withLeadingZeros = (value: string | number, zeros: number): string => {
    return `00${value}`.slice(`00${value}`.length - zeros);
  };

  const sendRgbColors = (color: { r: number; g: number; b: number }) => {
    const r = withLeadingZeros(color.r, 3);
    const g = withLeadingZeros(color.g, 3);
    const b = withLeadingZeros(color.b, 3);
    if (props.webSocketService) {
      props.webSocketService.send(`rgbctrl:r:${r}:g:${g}:b:${b}`);
    }
  };

  const sendWhiteLevels = (level: { kelvin: number; value: number }) => {
    const multiplier = level.value / 100; // Brightness Slider Multiplier
    const max = kelvinMax - kelvinMin;
    const relativeVal = level.kelvin - kelvinMin;
    const wMultiplier = Math.round((relativeVal / max) * 100) / 100;
    const wVal = Math.round(255 * wMultiplier);
    const wwVal = 255 - wVal < 0 ? 0 : 255 - wVal;
    const w = withLeadingZeros((wVal * multiplier).toFixed(0), 3);
    const ww = withLeadingZeros((wwVal * multiplier).toFixed(0), 3);

    if (props.webSocketService) {
      props.webSocketService.send(`whitectrl:w:${w}:ww:${ww}`);
    }
  };

  const handleControlModeToggle = (modeSwitch: ControlMode): void => {
    if (typeof props.onControlModeToggle === "function") {
      if (props.controlMode !== modeSwitch) {
        props.onControlModeToggle(modeSwitch);
        if (props.rgbColor && modeSwitch === ControlMode.RGB) {
          sendRgbColors(props.rgbColor);
        }
        if (
          kelvinValue &&
          whiteBrightness &&
          modeSwitch === ControlMode.WHITE
        ) {
          sendWhiteLevels({
            kelvin: kelvinValue,
            value: whiteBrightness,
          });
        }
      } else {
        props.onControlModeToggle(ControlMode.STANDBY);
      }
    }
  };

  return (
    <section>
      <div class="grid-large">
        <div class="form-group no-margin">
          <label for="modeRgb">RGB Test Mode</label>
          <ToggleSwitch
            on={props.controlMode === ControlMode.RGB}
            onClick={() => {
              handleControlModeToggle(ControlMode.RGB);
            }}
          />
          <div class="color-picker">
            <div id="rgb-color-picker"></div>
          </div>
          {props.controlMode === ControlMode.RGB && (
            <AlertWarning
              icon={AlertWarningIcon.INFO}
              text="While RGB test mode is enabled, Lumenator will test your selection. If Lumenator receives commands from other sources such as MQTT, the test will be overidden."
            />
          )}
        </div>
        <div class="form-group no-margin">
          <label for="modeWhite">White Test Mode</label>
          <ToggleSwitch
            on={props.controlMode === ControlMode.WHITE}
            onClick={() => {
              handleControlModeToggle(ControlMode.WHITE);
            }}
          />
          <div class="color-picker">
            <div id="white-color-picker"></div>
            <div id="white-value-picker"></div>
          </div>
          {props.controlMode === ControlMode.WHITE && (
            <AlertWarning
              icon={AlertWarningIcon.INFO}
              text="While white test mode is enabled, Lumenator will test your selection.  If Lumenator receives commands from other sources such as MQTT, the test will be overidden."
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ManualControl;
