import { Fragment, FunctionalComponent, h } from "preact";
import {
  IConfigDevice,
  IConfigGPIO,
} from "../../../lib/interfaces/IConfigJson";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import { IDeviceSetupProps } from "./IDeviceSetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const ManualControl: FunctionalComponent<IDeviceSetupProps> = (props) => {
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
    <Fragment>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="name">Device Name</label>
            <Input
              value={
                (props.deviceConfig && props.deviceConfig.name) || undefined
              }
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate(
                    {
                      ...(props.deviceConfig as IConfigDevice),
                      name: value as string,
                    },
                    {
                      ...(props.gpioConfig as IConfigGPIO),
                    }
                  );
                }
              }}
            />
          </div>
          <div class="form-group no-margin">
            <label for="name">Device Type</label>
            <DropdownMenu
              type="number"
              placeholder="Select a device type"
              value={
                props.deviceConfig && props.deviceConfig.type !== undefined
                  ? props.deviceConfig.type
                  : undefined
              }
              onSelect={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate(
                    {
                      ...(props.deviceConfig as IConfigDevice),
                      type: value as number,
                    },
                    {
                      ...(props.gpioConfig as IConfigGPIO),
                    }
                  );
                }
              }}
            >
              <option value="0">RGBWW (RGB w/ Cool / Warm White)</option>
              <option value="1">RGBW (RGB w/ White)</option>
              <option value="2">RGB</option>
              <option value="3">WW (Cool / Warm White)</option>
              <option value="4">W (White w/o Temp Control)</option>
            </DropdownMenu>
          </div>
        </div>
      </section>
      <section>
        <label>GPIO Mapping</label>
        <div class="grid-large mt-small">
          <div>
            <table>
              <tr class="header-row">
                <th>Channel</th>
                <th>GPIO</th>
                <th>Test</th>
              </tr>
              {props.deviceConfig &&
                (props.deviceConfig.type === DeviceType.RGB ||
                  props.deviceConfig.type === DeviceType.RGBW ||
                  props.deviceConfig.type === DeviceType.RGBWW) && (
                  <Fragment>
                    <tr>
                      <td>Red</td>
                      <td>
                        <Input
                          value={
                            props.gpioConfig ? props.gpioConfig.r : undefined
                          }
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate(
                                { ...(props.deviceConfig as IConfigDevice) },
                                {
                                  ...(props.gpioConfig as IConfigGPIO),
                                  r: value as number,
                                }
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <ToggleSwitch
                          on={props.controlMode === ControlMode.GPIO_R}
                          onClick={() => {
                            handleControlModeToggle(ControlMode.GPIO_R);
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Green</td>
                      <td>
                        <Input
                          value={
                            props.gpioConfig ? props.gpioConfig.g : undefined
                          }
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate(
                                { ...(props.deviceConfig as IConfigDevice) },
                                {
                                  ...(props.gpioConfig as IConfigGPIO),
                                  g: value as number,
                                }
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <ToggleSwitch
                          on={props.controlMode === ControlMode.GPIO_G}
                          onClick={() => {
                            handleControlModeToggle(ControlMode.GPIO_G);
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Blue</td>
                      <td>
                        <Input
                          value={
                            props.gpioConfig ? props.gpioConfig.b : undefined
                          }
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate(
                                { ...(props.deviceConfig as IConfigDevice) },
                                {
                                  ...(props.gpioConfig as IConfigGPIO),
                                  b: value as number,
                                }
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <ToggleSwitch
                          on={props.controlMode === ControlMode.GPIO_B}
                          onClick={() => {
                            handleControlModeToggle(ControlMode.GPIO_B);
                          }}
                        />
                      </td>
                    </tr>
                  </Fragment>
                )}
              {props.deviceConfig &&
                props.deviceConfig.type !== DeviceType.RGB && (
                  <tr>
                    <td>White</td>
                    <td>
                      <Input
                        value={
                          props.gpioConfig ? props.gpioConfig.w : undefined
                        }
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate(
                              { ...(props.deviceConfig as IConfigDevice) },
                              {
                                ...(props.gpioConfig as IConfigGPIO),
                                w: value as number,
                              }
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      <ToggleSwitch
                        on={props.controlMode === ControlMode.GPIO_W}
                        onClick={() => {
                          handleControlModeToggle(ControlMode.GPIO_W);
                        }}
                      />
                    </td>
                  </tr>
                )}
              {props.deviceConfig &&
                (props.deviceConfig.type === DeviceType.RGBWW ||
                  props.deviceConfig.type === DeviceType.WW) && (
                  <tr>
                    <td>Warm White</td>
                    <td>
                      <Input
                        value={
                          props.gpioConfig ? props.gpioConfig.ww : undefined
                        }
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate(
                              { ...(props.deviceConfig as IConfigDevice) },
                              {
                                ...(props.gpioConfig as IConfigGPIO),
                                ww: value as number,
                              }
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      <ToggleSwitch
                        on={props.controlMode === ControlMode.GPIO_WW}
                        onClick={() => {
                          handleControlModeToggle(ControlMode.GPIO_WW);
                        }}
                      />
                    </td>
                  </tr>
                )}
            </table>
            {/* <alert-message id="gpio-test-warning" icon="info"></alert-message> */}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default ManualControl;
