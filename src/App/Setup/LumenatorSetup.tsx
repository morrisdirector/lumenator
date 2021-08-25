import {
  AlertWarningIcon,
  AlertWarningType,
} from "../../lib/components/AlertWarning/IAlertWarningProps";
import { Component, h } from "preact";

import AlertWarning from "../../lib/components/AlertWarning/AlertWarning";
import { ConfigService } from "../../lib/services/config-service";
import { HardwareService } from "../../lib/services/hardware-service";
import { IConfigJson } from "../../lib/interfaces/IConfigJson";
import NavMenu from "../../lib/components/NavMenu/NavMenu";
import NavMenuTab from "../../lib/components/NavMenuTab/NavMenuTab";
import SetupForm from "./SetupForm/SetupForm";

interface ILumenatorSetupState {
  originalConfig?: IConfigJson;
  config?: IConfigJson;
}

class LumenatorSetup extends Component<null, ILumenatorSetupState> {
  private hardwareService = new HardwareService();
  private configService = new ConfigService();
  constructor() {
    super();
    this.state = {};
  }

  private init = async (): Promise<any> => {
    try {
      const data = await this.configService.loadConfigJson();
      if (data) {
        this.setState({ originalConfig: { ...data }, config: { ...data } });
      }
    } catch (error) {
      debugger;
    }
  };

  componentDidMount() {
    this.init();
  }

  private hasUnsavedChanges(): boolean {
    const original = JSON.stringify(this.state.originalConfig);
    const current = JSON.stringify(this.state.config);
    return original !== current;
  }

  render() {
    return (
      <div id="lumenator-web-app">
        <header>
          <div class="header-container">
            <div class="header-items">
              <h2>Lumenator</h2>
            </div>
          </div>
        </header>
        <NavMenu activeId={1}>
          <NavMenuTab id={1} title="Setup">
            <SetupForm
              config={this.state.config}
              onConfigUpdate={(config) => {
                this.setState({
                  config: {
                    ...config,
                  },
                });
              }}
            />
          </NavMenuTab>
        </NavMenu>
        {this.hasUnsavedChanges() && (
          <section class="action-section">
            <div>
              <AlertWarning
                icon={AlertWarningIcon.ALERT}
                type={AlertWarningType.BASIC_BORDERLESS}
                text="Unsaved Changes"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  this.setState({
                    config: { ...this.state.originalConfig } as IConfigJson,
                  });
                }}
              >
                Reset
              </button>
              <button
                class="primary"
                onClick={() => {
                  if (this.state.config) {
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
        )}
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
