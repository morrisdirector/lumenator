import * as iro from "@jaames/iro";

import {
  AlertWarningIcon,
  AlertWarningType,
} from "../../../lib/components/AlertWarning/IAlertWarningProps";
import { Fragment, FunctionalComponent, h } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";

import AlertWarning from "../../../lib/components/AlertWarning/AlertWarning";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { IConfigNetwork } from "../../../lib/interfaces/IConfigJson";
import { INetworkSetupProps } from "./INetworkSetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const NetworkSetup: FunctionalComponent<INetworkSetupProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Fragment>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="ssid">Network SSID</label>
            <Input
              id="ssid"
              value={(props.config && props.config.ssid) || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(props.config as IConfigNetwork),
                    ssid: value as string,
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
                  value={(props.config && props.config.pass) || undefined}
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate({
                        ...(props.config as IConfigNetwork),
                        pass: value as string,
                      });
                    }
                  }}
                />
              </div>
              <button
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
            <Input
              id="ssid"
              value={(props.config && props.config.ssid) || undefined}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(props.config as IConfigNetwork),
                    ssid: value as string,
                  });
                }
              }}
            />
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
