import { Fragment, FunctionalComponent, h } from "preact";
import {
  IConfigAccessPoint,
  IConfigNetwork,
} from "../../../lib/interfaces/IConfigJson";

import { INetworkSetupProps } from "./INetworkSetupProps";
import Input from "../../../lib/components/Input/Input";
import { useState } from "preact/hooks";

const NetworkSetup: FunctionalComponent<INetworkSetupProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAPPassword, setShowAPPassword] = useState(false);

  return (
    <Fragment>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="ssid">Network SSID</label>
            <Input
              id="ssid"
              value={
                (props.configNetwork && props.configNetwork.ssid) || undefined
              }
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    accessPoint: {
                      ...(props.configAccessPoint as IConfigAccessPoint),
                    },
                    network: {
                      ...(props.configNetwork as IConfigNetwork),
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
                  type={!showPassword ? "password" : "string"}
                  value={
                    (props.configNetwork && props.configNetwork.pass) ||
                    undefined
                  }
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        accessPoint: {
                          ...(props.configAccessPoint as IConfigAccessPoint),
                        },
                        network: {
                          ...(props.configNetwork as IConfigNetwork),
                          pass: value as string,
                        },
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
                  type={!showAPPassword ? "password" : "string"}
                  value={
                    (props.configAccessPoint && props.configAccessPoint.pass) ||
                    undefined
                  }
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        network: {
                          ...(props.configNetwork as IConfigNetwork),
                        },
                        accessPoint: {
                          ...(props.configAccessPoint as IConfigAccessPoint),
                          pass: value as string,
                        },
                      });
                    }
                  }}
                />
              </div>
              <button
                type="button"
                class="ml-small"
                onClick={() => {
                  setShowAPPassword(!showAPPassword);
                }}
              >
                {showAPPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div class="helper-text mt-large">
            Password for the setup access point page when Lumenator cannot
            connect to the network.
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default NetworkSetup;
