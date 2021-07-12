import { Fragment, FunctionalComponent, h } from "preact";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { ControlMode } from "../../../lib/enums/ControlMode";
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
              value={props.config?.name}
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
              value={props.config?.device_type}
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
            </DropdownMenu>
          </div>
          {/* <div class="form-group no-margin">
            <label for="map_preset">Device Preset</label>
            <DropdownMenu>
              <option value="" disabled selected>
                Select a device preset
              </option>
              <option value="" disabled>
                ---------------------------
              </option>
              <option value="custom">Custom Configuration</option>
              <option value="" disabled>
                ---------------------------
              </option>
              <option value="wemos">Wemos D1 Mini</option>
            </DropdownMenu>
          </div> */}
        </div>
        {/* <div class="grid-large">
                        <div class="form-group no-margin">
                            <label for="name">Device Name</label>
                            <text-input id="name"></text-input>
                        </div>
                        <div class="form-group no-margin">
                            <label for="map_preset">Device Preset</label>
                            <dropdown-menu id="map_preset">
                                <option value="" class="placeholder" disabled selected>Select a device preset
                                </option>
                                <option value="" class="placeholder" disabled>---------------------------</option>
                                <option value="custom">Custom Configuration</option>
                                <option value="" class="placeholder" disabled>---------------------------</option>
                                <option value="wemos">Wemos D1 Mini</option>
                            </dropdown-menu>
                        </div>
                    </div> */}
      </section>
      <section>
        {/* <h4>Configuration</h4>
                    <div class="grid-large">
                        <div class="form-group no-margin">
                            <label for="name">Device Type</label>
                            <dropdown-menu id="device_type" type="number">
                                <option value="" class="placeholder" disabled selected>Select a device type</option>
                                <option value="" class="placeholder" disabled>---------------------------</option>
                                <option value="0">RGBWW (RGB w/ Cool / Warm White)</option>
                                <option value="1">RGBW (RGB w/ White)</option>
                                <option value="2">RGB</option>
                            </dropdown-menu>
                        </div>
                    </div>
                    <hr>
                    <h4>GPIO Mapping</h4>
                    <div class="grid-large">
                        <div>
                            <table>
                                <tr class="header-row">
                                    <th>Channel</th>
                                    <th>GPIO</th>
                                    <th>Test</th>
                                </tr>
                                <tr>
                                    <td>Red</td>
                                    <td>
                                        <text-input id="gpio_r" type="number"></text-input>
                                    </td>
                                    <td>
                                        <toggle-switch id="ctrl-r" class="mode-toggle"></toggle-switch>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Green</td>
                                    <td>
                                        <text-input id="gpio_g" type="number"></text-input>
                                    </td>
                                    <td>
                                        <toggle-switch id="ctrl-g" class="mode-toggle"></toggle-switch>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Blue</td>
                                    <td>
                                        <text-input id="gpio_b" type="number"></text-input>
                                    </td>
                                    <td>
                                        <toggle-switch id="ctrl-b" class="mode-toggle"></toggle-switch>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Cool White</td>
                                    <td>
                                        <text-input id="gpio_w" type="number"></text-input>
                                    </td>
                                    <td>
                                        <toggle-switch id="ctrl-w" class="mode-toggle"></toggle-switch>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Warm White</td>
                                    <td>
                                        <text-input id="gpio_ww" type="number"></text-input>
                                    </td>
                                    <td>
                                        <toggle-switch id="ctrl-ww" class="mode-toggle"></toggle-switch>
                                    </td>
                                </tr>
                            </table>
                            <alert-message id="gpio-test-warning" icon="info">
                            </alert-message>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="primary" id="save-device-configuration">Save Configuration</button>
                    </div> */}
      </section>
    </Fragment>
  );
};

export default ManualControl;
