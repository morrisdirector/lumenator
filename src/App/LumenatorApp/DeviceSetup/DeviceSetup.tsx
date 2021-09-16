import * as SparkMD5 from "spark-md5";

import {
  AlertWarningIcon,
  AlertWarningType,
} from "../../../lib/components/AlertWarning/IAlertWarningProps";
import { Fragment, FunctionalComponent, h } from "preact";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { Conf } from "../../../lib/interfaces/IConfigJson";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import { IDeviceSetupProps } from "./IDeviceSetupProps";
import Input from "../../../lib/components/Input/Input";
import Progress from "../../../lib/components/Progress/Progress";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
import { useState } from "preact/hooks";

type DevicePage = "setup" | "update";

const ManualControl: FunctionalComponent<IDeviceSetupProps> = ({
  config = {},
  bannerService,
  hardwareService,
  websocketService,
  configService,
  ...props
}) => {
  const [devicePage, setDevicePage] = useState<DevicePage>("setup");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | undefined | null>();
  const [otaSuccess, setOtaSuccess] = useState(false);
  const [otaError, setOtaError] = useState<string | undefined | null>();
  const [otaProgress, setOtaProgress] = useState<number>(0);

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

  const fileMD5 = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const blobSlice =
        File.prototype.slice ||
        //@ts-ignore
        File.prototype.mozSlice ||
        //@ts-ignore
        File.prototype.webkitSlice;
      const chunkSize = 2097152; // Read in chunks of 2MB
      const chunks = Math.ceil(file.size / chunkSize);
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      let currentChunk = 0;
      const loadNext = () => {
        const start = currentChunk * chunkSize;
        const end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      };
      fileReader.onload = (e: Event) => {
        if (e.target) {
          const target = e.target as FileReader;
          spark.append(target.result as ArrayBuffer); // Append array buffer
          currentChunk += 1;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            const md5 = spark.end();
            resolve(md5);
          }
        }
      };
      fileReader.onerror = (e) => {
        reject(e);
      };
      loadNext();
    });
  };

  const uploadOTA = (): void => {
    setUploading(true);
    const formData = new FormData();

    const request = new XMLHttpRequest();

    request.addEventListener("load", () => {
      // request.response will hold the response from the server
      if (request.status === 200) {
        setOtaSuccess(true);
      } else if (request.status !== 500) {
        setOtaError(`[HTTP ERROR] ${request.statusText}`);
      } else {
        setOtaError(request.responseText);
      }
      setUploading(false);
      setOtaProgress(0);
    });

    // Upload progress
    request.upload.addEventListener("progress", (e) => {
      setOtaProgress(Math.trunc((e.loaded / e.total) * 100));
    });

    request.withCredentials = true;

    if (file) {
      fileMD5(file)
        .then((md5) => {
          formData.append("MD5", md5);
          formData.append("firmware", file, "firmware");
          request.open("post", "/update");
          request.send(formData);
        })
        .catch(() => {
          setOtaError(
            "Unknown error while upload, check the console for details."
          );
          setUploading(false);
          setOtaProgress(0);
        });
    }
  };

  const handleFirmwareSelection = (event: Event): void => {
    if (
      event !== null &&
      event.target &&
      (event.target as HTMLInputElement).files
    ) {
      const file = ((event.target as HTMLInputElement).files as FileList)[0];
      if (file) {
        setFile(file);
      }
    }
  };

  const goBack = (): void => {
    setFile(null);
    setOtaError(null);
    setOtaProgress(0);
    setDevicePage("setup");
  };

  return (
    <Fragment>
      {devicePage === "setup" && (
        <Fragment>
          <section>
            <div class="grid-large">
              <div class="form-group no-margin">
                <label for="name">Device Name</label>
                <Input
                  value={config[Conf.DEVICE_NAME] || undefined}
                  maxLength={40}
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        ...config,
                        [Conf.DEVICE_NAME]: value as string,
                      });
                    }
                  }}
                />
                <div class="helper-text">Max 40 characters</div>
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
                {(props.controlMode === ControlMode.GPIO_WW ||
                  props.controlMode === ControlMode.GPIO_W ||
                  props.controlMode === ControlMode.GPIO_R ||
                  props.controlMode === ControlMode.GPIO_G ||
                  props.controlMode === ControlMode.GPIO_B) && (
                  <AlertWarning
                    icon={AlertWarningIcon.INFO}
                    text="While GPIO testing is enabled, Lumenator will attempt to turn on the GPIO you are testing.  If Lumenator receives commands from other sources such as MQTT, the test will be overidden."
                  />
                )}
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
                                    typeof props.onControlModeToggle ===
                                    "function"
                                  ) {
                                    props.onControlModeToggle(
                                      ControlMode.STANDBY
                                    );
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
                <button
                  class="mb-small width-100"
                  onClick={() => {
                    setDevicePage("update");
                  }}
                >
                  Update Firmware
                </button>
              </div>
            </div>
          </section>
        </Fragment>
      )}
      {devicePage === "update" && (
        <Fragment>
          <div class="section-action">
            <button disabled={uploading} onClick={goBack}>
              Go back
            </button>
          </div>
          <section>
            <div class="grid-large">
              <div class="form-group no-margin">
                <label for="name" class="margin-bottom">
                  Update Firmware
                </label>
                <div>
                  <input
                    disabled={uploading}
                    class="form-input file-input"
                    type="file"
                    accept=".bin,.bin.gz"
                    onChange={handleFirmwareSelection}
                  />
                </div>
                <div class="helper-text margin-top">
                  Accepted file types are .bin and .bin.gz
                </div>
              </div>
              <div class="form-group no-margin"></div>
              {file && !uploading && (
                <div class="margin-top">
                  <button class="primary" onClick={uploadOTA}>
                    Upload
                  </button>
                  <button class="ml-small" onClick={goBack}>
                    Cancel
                  </button>
                </div>
              )}
              {uploading && otaProgress !== undefined && (
                <div>
                  <Progress progress={otaProgress || 0} />
                </div>
              )}
            </div>
            {!uploading && otaError && (
              <div class="margin-top">
                <AlertWarning
                  text={`ERROR: ${otaError}`}
                  type={AlertWarningType.ALERT}
                />
              </div>
            )}
          </section>
          <AlertWarning
            icon={AlertWarningIcon.ALERT}
            text="WARNING: Make sure you upload the correct binary file.  Once the device receives the file, it will attempt to install it.  If firmware other than Lumenator is installed, you may not be able to update over the air again, unless the new firmware supports it."
            type={AlertWarningType.DANGER}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default ManualControl;
