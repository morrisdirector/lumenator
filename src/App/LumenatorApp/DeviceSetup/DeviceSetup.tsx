import { Fragment, FunctionalComponent, h } from "preact";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import { IConfigDevice } from "../../../lib/interfaces/IConfigJson";
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
              value={(props.config && props.config.name) || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(props.config as IConfigDevice),
                    name: value as string,
                  });
                }
              }}
            />
          </div>
          <div class="form-group no-margin">
            <label for="name">Device Type</label>
            <DropdownMenu
              type="number"
              placeholder="Select a device type"
              value={(props.config && props.config.device_type) || undefined}
              onSelect={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(props.config as IConfigDevice),
                    device_type: value as number,
                  });
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
              {props.config &&
                (props.config.device_type === DeviceType.RGB ||
                  props.config.device_type === DeviceType.RGBW ||
                  props.config.device_type === DeviceType.RGBWW) && (
                  <Fragment>
                    <tr>
                      <td>Red</td>
                      <td>
                        <Input
                          value={
                            (props.config && props.config.gpio_r) || undefined
                          }
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate({
                                ...(props.config as IConfigDevice),
                                gpio_r: value as number,
                              });
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
                          value={props.config ? props.config.gpio_g : undefined}
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate({
                                ...(props.config as IConfigDevice),
                                gpio_g: value as number,
                              });
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
                          value={props.config ? props.config.gpio_b : undefined}
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate({
                                ...(props.config as IConfigDevice),
                                gpio_b: value as number,
                              });
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
              {props.config && props.config.device_type !== DeviceType.RGB && (
                <tr>
                  <td>White</td>
                  <td>
                    <Input
                      value={props.config ? props.config.gpio_w : undefined}
                      type="number"
                      onChange={(value) => {
                        if (typeof props.onConfigUpdate === "function") {
                          props.onConfigUpdate({
                            ...(props.config as IConfigDevice),
                            gpio_w: value as number,
                          });
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
              {props.config &&
                (props.config.device_type === DeviceType.RGBWW ||
                  props.config.device_type === DeviceType.WW) && (
                  <tr>
                    <td>Warm White</td>
                    <td>
                      <Input
                        value={props.config ? props.config.gpio_ww : undefined}
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate({
                              ...(props.config as IConfigDevice),
                              gpio_ww: value as number,
                            });
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
