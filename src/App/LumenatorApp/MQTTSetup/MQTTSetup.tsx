import { Conf, IConfigJson } from "../../../lib/interfaces/IConfigJson";
import { Fragment, FunctionalComponent, h } from "preact";
import {
  getIPConfigObject,
  getIPStringFromValues,
  isIPAddress,
} from "../../../lib/utils/utils";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import Chip from "../../../lib/components/Chip/Chip";
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

  const handleAutoDiscoveryEnable = (): void => {
    if (typeof props.onConfigUpdate === "function") {
      props.onConfigUpdate({
        ...(config as IConfigJson),
        [Conf.MQTT_AUTO_DISCOVERY]: !config[Conf.MQTT_AUTO_DISCOVERY],
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

  const isValidTopic = (str: string): boolean => {
    if (!str) {
      return false;
    }
    return str.search(/^(?:[a-z0-9\_\-]*\/)*(?:[a-z0-9\_\-]+)+$/g) > -1;
  };

  const handleTopicChange = (value?: string | number, blur = false) => {
    if (typeof props.onConfigUpdate === "function") {
      if (isValidTopic(value as string)) {
        props.onConfigUpdate({
          ...(config as IConfigJson),
          [Conf.MQTT_DEVICE_TOPIC]: value as string,
        });
      } else if (blur) {
        props.onConfigUpdate({
          ...(config as IConfigJson),
        });
      }
    }
  };

  const isValidClientId = (str: string): boolean => {
    if (!str) {
      return false;
    }
    return str.search(/^(?:[a-z0-9\_\-]*)$/g) > -1;
  };

  const handleClientIdChange = (value?: string | number, blur = false) => {
    if (typeof props.onConfigUpdate === "function") {
      if (isValidClientId(value as string)) {
        props.onConfigUpdate({
          ...(config as IConfigJson),
          [Conf.MQTT_CLIENT_ID]: value as string,
        });
      } else if (blur) {
        props.onConfigUpdate({
          ...(config as IConfigJson),
        });
      }
    }
  };

  return (
    <Fragment>
      <div class="section-action">
        <ToggleSwitch
          onClick={handleMQTTEnable}
          on={config[Conf.MQTT_ENABLED]}
        />
        <label>Enable MQTT</label>
      </div>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="clientId">Unique Client ID</label>
            <Input
              id="clientId"
              disabled={!config[Conf.MQTT_ENABLED]}
              value={config[Conf.MQTT_CLIENT_ID] || undefined}
              onChange={handleClientIdChange}
              onBlur={(value) => {
                handleClientIdChange(value, true);
              }}
            />
            <div class="helper-text mt-large">
              A unique ID for MQTT broker to identify the device. Alphanumeric
              characters, underscores, and dashes only. Example:{" "}
              <strong>bedroom_lamp1</strong>
            </div>
          </div>
          <div class="form-group no-margin">
            <label for="topic">Auto Discovery</label>
            <ToggleSwitch
              disabled={!config[Conf.MQTT_ENABLED]}
              onClick={handleAutoDiscoveryEnable}
              on={config[Conf.MQTT_AUTO_DISCOVERY]}
            />
            <div class="helper-text mt-large">
              See{" "}
              <a
                href="https://www.home-assistant.io/docs/mqtt/discovery/"
                target="_blank"
              >
                Home Assistant MQTT Discovery
              </a>{" "}
              for details.
            </div>
          </div>
          <div class="form-group">
            <label for="user">User</label>
            <Input
              id="user"
              disabled={!config[Conf.MQTT_ENABLED]}
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
                  disabled={!config[Conf.MQTT_ENABLED]}
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
              disabled={!config[Conf.MQTT_ENABLED]}
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
              disabled={!config[Conf.MQTT_ENABLED]}
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
            <label for="topic">Device Base Topic</label>
            <Input
              id="topic"
              disabled={!config[Conf.MQTT_ENABLED]}
              value={config[Conf.MQTT_DEVICE_TOPIC] || undefined}
              onChange={handleTopicChange}
              onBlur={(value) => {
                handleTopicChange(value, true);
              }}
            />
          </div>
          <div class="form-group">
            <label for="topic"></label>
            <div class="helper-text mt-large">
              The topic that all incoming and outgoing sub topics will be based
              on for this device. Example:{" "}
              <strong>upstairs/bedroom/lamp1</strong>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="form-group no-margin">
          <label>
            Availability Topic
            {config[Conf.MQTT_DEVICE_TOPIC] && (
              <div class="mb-small margin-top">
                <Chip text={`${config[Conf.MQTT_DEVICE_TOPIC]}/availability`} />
              </div>
            )}
          </label>
          <table>
            <tr class="header-row">
              <th>Message</th>
              <th width="100%">Description</th>
            </tr>
            <tr>
              <td>
                <Chip variant="basic" text="online"></Chip>
              </td>
              <td>
                The birth message sent to the broker when Lumenator comes
                online.
              </td>
            </tr>
            <tr>
              <td>
                <Chip variant="basic" text="offline"></Chip>
              </td>
              <td>The message sent as the last will and testament.</td>
            </tr>
          </table>
        </div>
      </section>
      <section>
        <div class="form-group no-margin">
          <label>
            State Topic
            {config[Conf.MQTT_DEVICE_TOPIC] && (
              <div class="mb-small margin-top">
                <Chip text={`${config[Conf.MQTT_DEVICE_TOPIC]}/state`} />
              </div>
            )}
          </label>
          <table>
            <tr class="header-row">
              <th>Message</th>
              <th width="100%">Description</th>
            </tr>
            <tr>
              <td>
                <Chip variant="basic" text="offline"></Chip>
              </td>
              <td>
                The birth message sent to the broker when Lumenator comes
                online.
              </td>
            </tr>
            <tr>
              <td>
                <Chip variant="basic" text="offline"></Chip>
              </td>
              <td>The message sent as the last will and testament.</td>
            </tr>
          </table>
        </div>
      </section>
      <section>
        <div class="form-group no-margin">
          <label>
            Command Topic
            {config[Conf.MQTT_DEVICE_TOPIC] && (
              <div class="mb-small margin-top">
                <Chip text={`${config[Conf.MQTT_DEVICE_TOPIC]}/set`} />
              </div>
            )}
          </label>
          <table>
            <tr class="header-row">
              <th>Message</th>
              <th width="100%">Description</th>
            </tr>
            <tr>
              <td>
                <Chip variant="basic" text="on"></Chip>
              </td>
              <td>Turn on the device.</td>
            </tr>
            <tr>
              <td>
                <Chip variant="basic" text="off"></Chip>
              </td>
              <td>Turn off the device.</td>
            </tr>
          </table>
        </div>
      </section>
    </Fragment>
  );
};

export default MQTTSetup;
