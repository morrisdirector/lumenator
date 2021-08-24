import { FunctionalComponent, h } from "preact";

import { IConfigJson } from "../../../lib/interfaces/IConfigJson";
import { ISetupFormProps } from "./ISetupFormProps";
import Input from "../../../lib/components/Input/Input";

const SetupForm: FunctionalComponent<ISetupFormProps> = ({
  config = {},
  ...props
}) => {
  return (
    <main>
      <section>
        <h4>Welcome!</h4>
        <p>
          To get started, fill out the network configuration form below, then
          click "Save and Restart". Once configured, Lumenator will try to
          connect to your wireless network. If unsuccessful, this access point
          will become available again for configuration.
        </p>
      </section>
      <section>
        <h4>Network Configuration</h4>
        <p>Lumenator will use these settings to attempt a wifi connection.</p>
        <div class="grid-large">
          <div class="form-group">
            <label for="name">Network SSID</label>
            <div class="flex-stretch">
              <div class="flex-grow">
                <Input
                  id="ssid"
                  value={(config.network && config.network.ssid) || undefined}
                  onChange={(val) => {
                    if (typeof props.onConfigUpdate === "function") {
                      if (config.network) {
                        props.onConfigUpdate({
                          ...(config as IConfigJson),
                          network: { ...config.network, ssid: val as string },
                        });
                      }
                    }
                  }}
                />
              </div>
              {/* TODO: Bring back scanner */}
              {/* <button id="network-scan">Scan</button> */}
            </div>
          </div>
          <div class="form-group">
            <label for="pass">Network Password</label>
            <Input
              id="pass"
              value={(config.network && config.network.pass) || undefined}
              onChange={(val) => {
                if (typeof props.onConfigUpdate === "function") {
                  if (config.network) {
                    props.onConfigUpdate({
                      ...(config as IConfigJson),
                      network: { ...config.network, pass: val as string },
                    });
                  }
                }
              }}
            />
          </div>
        </div>
      </section>
      <section>
        <h4>Access Point Configuration</h4>
        <p>For security, it is recommended to add an access point password.</p>
        <div class="grid-large">
          <div class="form-group">
            <label for="apPass">Access Point Security Password</label>
            <Input
              id="apPass"
              value={
                (config.accessPoint && config.accessPoint.pass) || undefined
              }
              onChange={(val) => {
                if (typeof props.onConfigUpdate === "function") {
                  if (config.accessPoint) {
                    props.onConfigUpdate({
                      ...(config as IConfigJson),
                      accessPoint: {
                        ...config.accessPoint,
                        pass: val as string,
                      },
                    });
                  }
                }
              }}
            />
            <div class="helper-text">
              Password for the setup access point (this page) when Lumenator
              cannot connect to the network.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SetupForm;
