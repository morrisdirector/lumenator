import { Conf, IConfigJson } from "../../../lib/interfaces/IConfigJson";
import { Fragment, FunctionalComponent, h } from "preact";
import {
  getIPConfigObject,
  getIPStringFromValues,
  isIPAddress,
} from "../../../lib/utils/utils";

import { IMQTTSetupProps } from "./IMQTTSetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";
import { useState } from "preact/hooks";

const MQTTSetup: FunctionalComponent<IMQTTSetupProps> = ({
  config = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMQTTEnable = (): void => {
    if (typeof props.onConfigUpdate === "function") {
      props.onConfigUpdate({
        ...(config as IConfigJson),
        [Conf.MQTT_ENABLED]: !config[Conf.MQTT_ENABLED],
      });
    }
  };

  const handleIpChange = (value?: string | number, blur = false) => {
    if (typeof props.onConfigUpdate === "function") {
      if (isIPAddress(value as string)) {
        const ipObj = getIPConfigObject(value as string);
        if (ipObj) {
          props.onConfigUpdate({
            ...(config as IConfigJson),
            [Conf.MQTT_IP1]: ipObj.a,
            [Conf.MQTT_IP2]: ipObj.b,
            [Conf.MQTT_IP3]: ipObj.c,
            [Conf.MQTT_IP4]: ipObj.d,
          });
        }
      } else if (blur) {
        props.onConfigUpdate({
          ...(config as IConfigJson),
        });
      }
    }
  };

  return (
    <Fragment>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="client">Client Name</label>
            <Input
              id="client"
              value={config[Conf.MQTT_CLIENT_NAME] || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.MQTT_CLIENT_NAME]: value as string,
                  });
                }
              }}
            />
          </div>
          <div class="form-group no-margin">
            <label>Enable MQTT</label>
            <ToggleSwitch
              onClick={handleMQTTEnable}
              on={config[Conf.MQTT_ENABLED]}
            />
          </div>
          <div class="form-group">
            <label for="user">User</label>
            <Input
              id="user"
              value={config[Conf.MQTT_USER] || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.MQTT_USER]: value as string,
                  });
                }
              }}
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <div class="flex-stretch">
              <div class="flex-grow">
                <Input
                  id="password"
                  type={!showPassword ? "password" : "string"}
                  value={config[Conf.MQTT_PASSWORD] || undefined}
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        ...(config as IConfigJson),
                        [Conf.MQTT_PASSWORD]: value as string,
                      });
                    }
                  }}
                />
              </div>
              <button
                type="button"
                class="ml-small"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="ip">MQTT Server IP</label>
            <Input
              value={
                getIPStringFromValues(
                  config[Conf.MQTT_IP1],
                  config[Conf.MQTT_IP2],
                  config[Conf.MQTT_IP3],
                  config[Conf.MQTT_IP4]
                ) || ""
              }
              onChange={handleIpChange}
              onBlur={(value) => {
                handleIpChange(value, true);
              }}
            />
          </div>
          <div class="form-group">
            <label for="port">Port</label>
            <Input
              type="number"
              value={config[Conf.MQTT_PORT] || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.MQTT_PORT]: value as number,
                  });
                }
              }}
            />
          </div>
        </div>
      </section>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="topic">Device Topic</label>
            <Input
              id="topic"
              value={config[Conf.MQTT_DEVICE_TOPIC] || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.MQTT_DEVICE_TOPIC]: value as string,
                  });
                }
              }}
            />
            <div class="helper-text mt-large">
              The topic that all messages will be sent and received on for this
              device. Example: lumenator/kitchen.
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default MQTTSetup;
