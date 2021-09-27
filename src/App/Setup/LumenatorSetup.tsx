import { Component, Fragment, h } from "preact";
import { Conf, IConfigJson } from "../../lib/interfaces/IConfigJson";

import { ConfigService } from "../../lib/services/config-service";
import { HardwareService } from "../../lib/services/hardware-service";
import Input from "../../lib/components/Input/Input";
import Loader from "../../lib/components/Loader/Loader";
import NavMenu from "../../lib/components/NavMenu/NavMenu";
import NavMenuTab from "../../lib/components/NavMenuTab/NavMenuTab";
import NetworkSetup from "../LumenatorApp/NetworkSetup/NetworkSetup";

interface ILumenatorSetupState {
  accessGranted: boolean;
  errorText: string;
  password?: string;
  loading?: boolean;
  originalConfig?: IConfigJson;
  config?: IConfigJson;
}

class LumenatorSetup extends Component<null, ILumenatorSetupState> {
  private hardwareService = new HardwareService();
  private configService = new ConfigService();
  constructor() {
    super();
    this.state = { accessGranted: false, errorText: "" };
    this.renderActionSection = this.renderActionSection.bind(this);
  }

  private init = async (): Promise<any> => {
    try {
      const data = await this.configService.loadConfigJson();
      if (data) {
        this.setState({ originalConfig: { ...data }, config: { ...data } });
      }
      if (!data[Conf.ACCESS_POINT_PASS]) {
        this.setState({ accessGranted: true });
      }
    } catch (error) {
      debugger;
    }
  };

  componentDidMount() {
    this.init();
  }

  private renderActionSection(): h.JSX.Element {
    return this.configService.hasUnsavedChanges(
      this.state.originalConfig,
      this.state.config
    ) ? (
      <section class="action-section no-margin">
        <div>
          <button
            onClick={() => {
              this.setState({
                config: { ...this.state.originalConfig } as IConfigJson,
              });
            }}
          >
            Start Over
          </button>
          <button
            class="primary"
            onClick={() => {
              if (this.state.config) {
                this.setState({ loading: true });
                this.configService
                  .saveConfigJson(this.state.config)
                  .then((result) => {
                    if (result === true) {
                      this.setState({
                        originalConfig: {
                          ...this.state.config,
                        } as IConfigJson,
                      });
                      this.hardwareService.restart();
                    }
                  });
              }
            }}
          >
            Save and Restart
          </button>
        </div>
      </section>
    ) : (
      <Fragment></Fragment>
    );
  }

  private login = (): void => {
    if (this.state.originalConfig) {
      if (
        this.state.originalConfig[Conf.ACCESS_POINT_PASS] == this.state.password
      ) {
        this.setState({ accessGranted: true });
      } else {
        this.setState({ errorText: "Invalid password" });
      }
    }
  };

  render() {
    return (
      <div id="lumenator-web-app">
        {this.state.loading && <Loader></Loader>}
        <header>
          <div class="header-container">
            <div class="header-items">
              <h2>Lumenator</h2>
            </div>
          </div>
        </header>
        <NavMenu
          minimized={true}
          activeId={1}
          renderActionSection={this.renderActionSection}
        >
          <NavMenuTab id={1} title="Setup">
            {(!this.state.accessGranted && (
              <section style={{ maxWidth: "400px" }}>
                <div class="form-group no-margin">
                  <label>Setup Password</label>
                  <div className="flex-stretch">
                    <div class="flex-grow">
                      <Input
                        onEnter={this.login}
                        onChange={(value) => {
                          this.setState({ password: value as string });
                        }}
                        type="password"
                      ></Input>
                    </div>
                    <button class="primary ml-small" onClick={this.login}>
                      Go
                    </button>
                  </div>
                </div>
                <div class="error-text">{this.state.errorText}</div>
              </section>
            )) || (
              <Fragment>
                <section>
                  <h4>Welcome!</h4>
                  <p>
                    To get started, fill out the network configuration form
                    below, then click "Save and Restart". Once configured,
                    Lumenator will try to connect to your wireless network. If
                    unsuccessful, this access point will become available again
                    for configuration.
                  </p>
                </section>
                <NetworkSetup
                  page="setup"
                  config={this.state.config}
                  onConfigUpdate={(config) => {
                    this.setState({ config: { ...config } });
                  }}
                />
              </Fragment>
            )}
          </NavMenuTab>
        </NavMenu>
      </div>
    );
  }
}

export default LumenatorSetup;
