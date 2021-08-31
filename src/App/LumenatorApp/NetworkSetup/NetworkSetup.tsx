import { Conf, IConfigJson } from "../../../lib/interfaces/IConfigJson";
import { Fragment, FunctionalComponent, h } from "preact";
import {
  getIPConfigObject,
  getIPStringFromValues,
  isIPAddress,
} from "../../../lib/utils/utils";

import { INetworkSetupProps } from "./INetworkSetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
import { useState } from "preact/hooks";

const NetworkSetup: FunctionalComponent<INetworkSetupProps> = ({
  page = "app",
  config = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAPPassword, setShowAPPassword] = useState(false);

  const handleIpChange = (
    value?: string | number,
    blur = false,
    key: "IP" | "GATEWAY" | "SUBNET" = "IP"
  ) => {
    if (typeof props.onConfigUpdate === "function") {
      if (isIPAddress(value as string)) {
        const ipObj = getIPConfigObject(value as string);
        if (ipObj) {
          props.onConfigUpdate({
            ...(config as IConfigJson),
            //@ts-ignore
            [Conf[`NETWORK_${key}1`]]: ipObj.a,
            //@ts-ignore
            [Conf[`NETWORK_${key}2`]]: ipObj.b,
            //@ts-ignore
            [Conf[`NETWORK_${key}3`]]: ipObj.c,
            //@ts-ignore
            [Conf[`NETWORK_${key}4`]]: ipObj.d,
          });
        }
      } else if (blur) {
        props.onConfigUpdate({
          ...(config as IConfigJson),
        });
      }
    }
  };

  const handleDhcpToggle = (): void => {
    if (typeof props.onConfigUpdate === "function") {
      props.onConfigUpdate({
        ...(config as IConfigJson),
        [Conf.NETWORK_DHCP]: !config[Conf.NETWORK_DHCP],
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
              value={config[Conf.NETWORK_SSID] || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.NETWORK_SSID]: value as string,
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
                  value={config[Conf.NETWORK_PASS] || undefined}
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        ...(config as IConfigJson),
                        [Conf.NETWORK_PASS]: value as string,
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
              disabled={config[Conf.NETWORK_DHCP]}
              value={
                getIPStringFromValues(
                  config[Conf.NETWORK_IP1],
                  config[Conf.NETWORK_IP2],
                  config[Conf.NETWORK_IP3],
                  config[Conf.NETWORK_IP4]
                ) || ""
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
            <ToggleSwitch
              onClick={handleDhcpToggle}
              on={config[Conf.NETWORK_DHCP]}
            />
          </div>
          <div class="form-group">
            <label for="ip">Gateway</label>
            <Input
              disabled={config[Conf.NETWORK_DHCP]}
              value={
                getIPStringFromValues(
                  config[Conf.NETWORK_GATEWAY1],
                  config[Conf.NETWORK_GATEWAY2],
                  config[Conf.NETWORK_GATEWAY3],
                  config[Conf.NETWORK_GATEWAY4]
                ) || ""
              }
              onChange={(value) => {
                handleIpChange(value, false, "GATEWAY");
              }}
              onBlur={(value) => {
                handleIpChange(value, true, "GATEWAY");
              }}
            />
          </div>
          <div></div>
          <div class="form-group">
            <label for="ip">Subnet</label>
            <Input
              disabled={config[Conf.NETWORK_DHCP]}
              value={
                getIPStringFromValues(
                  config[Conf.NETWORK_SUBNET1],
                  config[Conf.NETWORK_SUBNET2],
                  config[Conf.NETWORK_SUBNET3],
                  config[Conf.NETWORK_SUBNET4]
                ) || ""
              }
              onChange={(value) => {
                handleIpChange(value, false, "SUBNET");
              }}
              onBlur={(value) => {
                handleIpChange(value, true, "SUBNET");
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
                  value={config[Conf.ACCESS_POINT_PASS] || undefined}
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        ...(config as IConfigJson),
                        [Conf.ACCESS_POINT_PASS]: value as string,
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
