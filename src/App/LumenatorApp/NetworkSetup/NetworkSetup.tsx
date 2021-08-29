import { Fragment, FunctionalComponent, h } from "preact";
import {
  IConfigAccessPoint,
  IConfigNetwork,
} from "../../../lib/interfaces/IConfigJson";
import {
  getIPConfigObject,
  getIPStringFromConfig,
  isIPAddress,
} from "../../../lib/utils/utils";
import { useEffect, useState } from "preact/hooks";

import { INetworkSetupProps } from "./INetworkSetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const NetworkSetup: FunctionalComponent<INetworkSetupProps> = ({
  page = "app",
  configNetwork = {},
  configAccessPoint = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAPPassword, setShowAPPassword] = useState(false);

  const handleIpChange = (
    value?: string | number,
    blur = false,
    key: string = "ip"
  ) => {
    if (typeof props.onConfigUpdate === "function") {
      if (isIPAddress(value as string)) {
        props.onConfigUpdate({
          accessPoint: {
            ...(configAccessPoint as IConfigAccessPoint),
          },
          network: {
            ...(configNetwork as IConfigNetwork),
            [key]: getIPConfigObject(value as string),
          },
        });
      } else if (blur) {
        props.onConfigUpdate({
          accessPoint: {
            ...(configAccessPoint as IConfigAccessPoint),
          },
          network: {
            ...(configNetwork as IConfigNetwork),
          },
        });
      }
    }
  };

  const handleDhcpToggle = (): void => {
    if (typeof props.onConfigUpdate === "function") {
      props.onConfigUpdate({
        accessPoint: {
          ...(configAccessPoint as IConfigAccessPoint),
        },
        network: {
          ...(configNetwork as IConfigNetwork),
          dhcp: !configNetwork.dhcp,
        },
      });
    }
  };

  return (
    <Fragment>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="ssid">Network SSID</label>
            <Input
              id="ssid"
              value={configNetwork.ssid || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    accessPoint: {
                      ...(configAccessPoint as IConfigAccessPoint),
                    },
                    network: {
                      ...(configNetwork as IConfigNetwork),
                      ssid: value as string,
                    },
                  });
                }
              }}
            />
          </div>
          <div class="form-group no-margin">
            <label for="password">Network Password</label>
            <div class="flex-stretch">
              <div class="flex-grow">
                <Input
                  id="password"
                  type={!showPassword && page === "app" ? "password" : "string"}
                  value={configNetwork.pass || undefined}
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        accessPoint: {
                          ...(configAccessPoint as IConfigAccessPoint),
                        },
                        network: {
                          ...(configNetwork as IConfigNetwork),
                          pass: value as string,
                        },
                      });
                    }
                  }}
                />
              </div>
              {page === "app" && (
                <button
                  type="button"
                  class="ml-small"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>
          </div>
          <div class="form-group">
            <label for="ip">Static IP</label>
            <Input
              disabled={configNetwork.dhcp}
              value={
                (configNetwork.ip && getIPStringFromConfig(configNetwork.ip)) ||
                ""
              }
              onChange={handleIpChange}
              onBlur={(value) => {
                handleIpChange(value, true);
              }}
            />
            <div class="helper-text mt-large">
              Static IPv4 address on the local network.
            </div>
          </div>
          <div class="form-group">
            <label for="ip">Use DHCP</label>
            <ToggleSwitch onClick={handleDhcpToggle} on={configNetwork.dhcp} />
          </div>
          <div class="form-group">
            <label for="ip">Gateway</label>
            <Input
              disabled={configNetwork.dhcp}
              value={
                (configNetwork.gateway &&
                  getIPStringFromConfig(configNetwork.gateway)) ||
                ""
              }
              onChange={(value) => {
                handleIpChange(value, false, "gateway");
              }}
              onBlur={(value) => {
                handleIpChange(value, true, "gateway");
              }}
            />
          </div>
          <div></div>
          <div class="form-group">
            <label for="ip">Subnet</label>
            <Input
              disabled={configNetwork.dhcp}
              value={
                (configNetwork.subnet &&
                  getIPStringFromConfig(configNetwork.subnet)) ||
                ""
              }
              onChange={(value) => {
                handleIpChange(value, false, "subnet");
              }}
              onBlur={(value) => {
                handleIpChange(value, true, "subnet");
              }}
            />
          </div>
        </div>
      </section>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="ssid">Access Point Security Password</label>
            <div class="flex-stretch">
              <div class="flex-grow">
                <Input
                  id="apPass"
                  type={
                    !showAPPassword && page === "app" ? "password" : "string"
                  }
                  value={configAccessPoint.pass || undefined}
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        network: {
                          ...(configNetwork as IConfigNetwork),
                        },
                        accessPoint: {
                          ...(configAccessPoint as IConfigAccessPoint),
                          pass: value as string,
                        },
                      });
                    }
                  }}
                />
              </div>
              {page === "app" && (
                <button
                  type="button"
                  class="ml-small"
                  onClick={() => {
                    setShowAPPassword(!showAPPassword);
                  }}
                >
                  {showAPPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>
            <div class="helper-text mt-large">
              Password for the setup access point{" "}
              {page === "setup" ? "(this page)" : ""} when Lumenator cannot
              connect to the network.
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default NetworkSetup;
