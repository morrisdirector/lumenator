import { Fragment, FunctionalComponent, h } from "preact";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { AlertWarningType } from "../../../lib/components/AlertWarning/IAlertWarningProps";
import { Conf } from "../../../lib/interfaces/IConfigJson";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import { HardwareService } from "../../../lib/services/hardware-service";
import { IDeviceSetupProps } from "./IDeviceSetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const ManualControl: FunctionalComponent<IDeviceSetupProps> = ({
  config = {},
  bannerService,
  hardwareService,
  websocketService,
  configService,
  ...props
}) => {
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
              value={config[Conf.DEVICE_NAME] || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...config,
                    [Conf.DEVICE_NAME]: value as string,
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
              value={config[Conf.DEVICE_TYPE] || undefined}
              onSelect={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...config,
                    [Conf.DEVICE_TYPE]: value as number,
                  });
                }
              }}
            >
              <option value="1">RGBWW (RGB w/ Cool / Warm White)</option>
              <option value="2">RGBW (RGB w/ White)</option>
              <option value="3">RGB</option>
              <option value="4">WW (Cool / Warm White)</option>
              <option value="5">W (White w/o Temp Control)</option>
            </DropdownMenu>
          </div>
        </div>
      </section>
      <section>
        <div class="grid-large">
          <div>
            <label class="mb-small">GPIO Mapping</label>
            <table>
              <tr class="header-row">
                <th>Channel</th>
                <th>GPIO</th>
                <th>Test</th>
              </tr>
              {(config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) && (
                <Fragment>
                  <tr>
                    <td>Red</td>
                    <td>
                      <Input
                        value={config[Conf.GPIO_R] || undefined}
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate({
                              ...config,
                              [Conf.GPIO_R]: value as number,
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
                        value={config[Conf.GPIO_G] || undefined}
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate({
                              ...config,
                              [Conf.GPIO_G]: value as number,
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
                        value={config[Conf.GPIO_B] || undefined}
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate({
                              ...config,
                              [Conf.GPIO_B]: value as number,
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
              {config[Conf.DEVICE_TYPE] !== DeviceType.RGB && (
                <tr>
                  <td>White</td>
                  <td>
                    <Input
                      value={config[Conf.GPIO_W] || undefined}
                      type="number"
                      onChange={(value) => {
                        if (typeof props.onConfigUpdate === "function") {
                          props.onConfigUpdate({
                            ...config,
                            [Conf.GPIO_W]: value as number,
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
              {(config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                config[Conf.DEVICE_TYPE] === DeviceType.WW) && (
                <tr>
                  <td>Warm White</td>
                  <td>
                    <Input
                      value={config[Conf.GPIO_WW] || undefined}
                      type="number"
                      onChange={(value) => {
                        if (typeof props.onConfigUpdate === "function") {
                          props.onConfigUpdate({
                            ...config,
                            [Conf.GPIO_WW]: value as number,
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
          <div>
            <label class="mb-small">System</label>
            <button
              class="mb-small width-100"
              onClick={() => {
                if (bannerService) {
                  bannerService.newDialog({
                    warningText: "Are you sure?",
                    okText: "Restart",
                    okClass: "alert",
                    onOk: () => {
                      if (typeof props.onLoading === "function") {
                        props.onLoading(true);
                      }
                      if (hardwareService && websocketService) {
                        hardwareService.restart();
                        setTimeout(() => {
                          websocketService.close();
                          websocketService.reconnect().then((connected) => {
                            if (connected) {
                              bannerService.clear();
                              bannerService.addMessage(
                                <AlertWarning
                                  text="Restarted successfully"
                                  autoClose={true}
                                  closable={true}
                                />
                              );
                              if (
                                typeof props.onControlModeToggle === "function"
                              ) {
                                props.onControlModeToggle(ControlMode.STANDBY);
                              }
                              if (typeof props.onLoading === "function") {
                                props.onLoading(false);
                              }
                            }
                          });
                        }, 1000);
                      }
                    },
                  });
                }
              }}
            >
              Restart
            </button>
            <button
              class="mb-small width-100"
              onClick={() => {
                if (bannerService) {
                  bannerService.newDialog({
                    warningText: "Are you sure? This cannot be undone.",
                    okText: "Erase All",
                    okClass: "alert",
                    onOk: () => {
                      if (typeof props.onLoading === "function") {
                        props.onLoading(true);
                      }
                      if (hardwareService && websocketService) {
                        hardwareService.eraseAll();
                        setTimeout(() => {
                          bannerService.clear();
                          bannerService.addMessage(
                            <AlertWarning
                              text="Erased configuration.  Restarting device..."
                              autoCloseDuration={10}
                              autoClose={true}
                              closable={true}
                            />
                          );
                          if (typeof props.onLoading === "function") {
                            props.onLoading(false);
                          }
                          setTimeout(() => {
                            bannerService.clear();
                            bannerService.addMessage(
                              <AlertWarning
                                text="Device has restarted in access point mode.  Connect to the device access point to set up Lumenator."
                                type={AlertWarningType.DANGER}
                              />
                            );
                            hardwareService.restart();
                          }, 10000);
                        }, 1000);
                      }
                    },
                  });
                }
              }}
            >
              Erase Configuration
            </button>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default ManualControl;
