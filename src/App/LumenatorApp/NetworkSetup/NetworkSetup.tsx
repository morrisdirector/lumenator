import * as iro from "@jaames/iro";

import {
  AlertWarningIcon,
  AlertWarningType,
} from "../../../lib/components/AlertWarning/IAlertWarningProps";
import { FunctionalComponent, h } from "preact";
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
    <section>
      <div class="grid-large">
        <div class="form-group no-margin">
          <label for="ssid">SSID</label>
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
          <label for="password">Password</label>
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
  );
};

export default NetworkSetup;
