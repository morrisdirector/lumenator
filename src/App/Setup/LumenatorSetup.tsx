import {
  AlertWarningIcon,
  AlertWarningType,
} from "../../lib/components/AlertWarning/IAlertWarningProps";
import { Component, Fragment, h } from "preact";
import { Conf, IConfigJson } from "../../lib/interfaces/IConfigJson";

import AlertWarning from "../../lib/components/AlertWarning/AlertWarning";
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

            {/* <SetupForm
              config={this.state.config}
              onConfigUpdate={(config) => {
                this.setState({
                  config: {
                    ...config,
                  },
                });
              }}
            /> */}
          </NavMenuTab>
        </NavMenu>
        {JSON.stringify(this.state.config)}
      </div>
    );
  }
}

export default LumenatorSetup;

// // import { Modal } from './components/Modal/Modal';
// import { CustomElement } from './components/BaseComponent/BaseComponent';
// import { ITableConfigProps } from './components/Table/ITableProps';
// import { LumenatorBase } from './lumenator-base';

// export class LumenatorSetup extends LumenatorBase {
// 	public networksTableConfig: ITableConfigProps = {
// 		columns: [
// 			{ key: 'ssid', header: 'SSID' },
// 			{ key: 'rssi', header: 'RSSI' },
// 			{ key: 'enc', header: 'Encryption' },
// 			{
// 				actionButtons: [
// 					{
// 						variant: 'default',
// 						label: 'Click me',
// 						callback: (row) => {
// 							console.log(row);
// 						}
// 					}
// 				]
// 			}
// 		]
// 	};
// 	constructor(private devMode) {
// 		super();
// 		this.addEventListeners();
// 		(document.getElementById('scan-table') as CustomElement).setState({ config: this.networksTableConfig });
// 	}

// 	private addEventListeners = (): void => {
// 		this.element('#network-scan').addEventListener('click', this.scanForNetworks);
// 	};

// 	private scanForNetworks = (): void => {
// 		const modal: CustomElement = document.getElementById('network-modal') as CustomElement;
// 		modal.setState({
// 			open: true,
// 			loading: false,
// 			actionButtons: [
// 				{
// 					variant: 'default',
// 					label: 'Cancel',
// 					callback: () => {
// 						modal.setState({ open: false });
// 					}
// 				}
// 			]
// 		});
// 	};
// }
