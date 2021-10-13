import {
  BannerService,
  IDialogConfig,
} from "../../lib/services/banner-service";
import { Component, h } from "preact";
import { Conf, IConfigJson } from "../../lib/interfaces/IConfigJson";

import AlertWarning from "../../lib/components/AlertWarning/AlertWarning";
import { AlertWarningIcon } from "../../lib/components/AlertWarning/IAlertWarningProps";
import Chip from "../../lib/components/Chip/Chip";
import { ConfigService } from "../../lib/services/config-service";
import { ControlMode } from "../../lib/enums/ControlMode";
import DeviceSetup from "./DeviceSetup/DeviceSetup";
import E131Setup from "./E131Setup/E131Setup";
import { HardwareService } from "../../lib/services/hardware-service";
import { IOnColorSetData } from "./ManualControl/IManualControlProps";
import Loader from "../../lib/components/Loader/Loader";
import MQTTSetup from "./MQTTSetup/MQTTSetup";
import ManualControl from "./ManualControl/ManualControl";
import NavMenu from "../../lib/components/NavMenu/NavMenu";
import NavMenuTab from "../../lib/components/NavMenuTab/NavMenuTab";
import NetworkSetup from "./NetworkSetup/NetworkSetup";
import { OnOff } from "../../lib/enums/OnOff";
import { WebsocketService } from "../../lib/services/websocket-service";

export interface ILumenatorAppState {
  controlMode?: ControlMode;
  loading?: boolean;
  originalConfig?: IConfigJson;
  config?: IConfigJson;
  rgbColor?: { r: number; g: number; b: number };
  whiteColor?: { r: number; g: number; b: number };
  whiteValueColor?: { r: number; g: number; b: number };
}
class LumenatorApp extends Component<null, ILumenatorAppState> {
  private configService = new ConfigService();
  private websocketService = new WebsocketService();
  private hardwareService = new HardwareService();
  public bannerService = new BannerService((newState?: ILumenatorAppState) => {
    this.forceUpdate();
    if (newState) {
      this.setState(newState);
    }
  });
  public saveChangesDialog: IDialogConfig;

  constructor() {
    super();
    this.state = {
      controlMode: ControlMode.STANDBY,
      loading: true,
    };

    this.saveChangesDialog = {
      id: "saveChanges",
      warningText: "Unsaved Changes",
      warningIcon: AlertWarningIcon.ALERT,
      okText: "Save Configuration",
      onOk: () => {
        this.saveConfiguration();
      },
      onCancel: () => {
        this.setState({
          config: { ...this.state.originalConfig } as IConfigJson,
        });
        this.bannerService.clear();
      },
    };
    this.saveConfiguration = this.saveConfiguration.bind(this);
  }

  private init = async (): Promise<any> => {
    try {
      const data = await this.configService.loadConfigJson();
      if (data) {
        this.setState({
          originalConfig: { ...data },
          config: { ...data },
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(): void {
    if (
      (!this.bannerService.dialogConfig ||
        this.bannerService.dialogConfig.id !== this.saveChangesDialog.id) &&
      this.configService.hasUnsavedChanges(
        this.state.originalConfig,
        this.state.config
      )
    ) {
      this.bannerService.newDialog(this.saveChangesDialog);
    }
  }

  private isGpioMode = (mode?: ControlMode): boolean => {
    return (
      mode === ControlMode.GPIO_B ||
      mode === ControlMode.GPIO_G ||
      mode === ControlMode.GPIO_R ||
      mode === ControlMode.GPIO_W ||
      mode === ControlMode.GPIO_WW
    );
  };

  private handleControlModeToggle = (newMode: ControlMode): void => {
    if (this.isGpioMode(this.state.controlMode)) {
      // Turn off the old GPIO
      this.websocketService.send(`gpio:${this.state.controlMode}:${OnOff.OFF}`);
    }
    if (this.isGpioMode(newMode)) {
      // Turn on the new GPIO
      this.websocketService.send(`gpio:${newMode}:${OnOff.ON}`);
    }
    if (newMode === ControlMode.STANDBY) {
      this.websocketService.send(`standby`);
    }
    this.setState({ controlMode: newMode });
  };

  private handleColorSet = (data: IOnColorSetData): void => {
    if (data.type === "rgb") {
      this.setState({ rgbColor: data.color });
    }
    if (data.type === "white") {
      this.setState({ whiteColor: data.color });
    }
    if (data.type === "whiteValue") {
      this.setState({ whiteValueColor: data.color });
    }
  };

  private saveConfiguration(): void {
    this.setState({ loading: true });
    if (this.state.config) {
      this.configService.saveConfigJson(this.state.config).then((result) => {
        if (result === true) {
          setTimeout(() => {
            this.setState({
              originalConfig: {
                ...this.state.config,
              } as IConfigJson,
              loading: false,
            });
            this.bannerService.clear();
            this.bannerService.addMessage(
              <AlertWarning
                text="Configuration saved successfully"
                closable={true}
                autoClose={true}
              ></AlertWarning>
            );
          }, 1000);
        }
      });
    }
  }

  render() {
    return (
      <div id="lumenator-web-app">
        {this.state.loading && <Loader></Loader>}
        <header>
          <div class="header-container">
            <div class="header-items">
              <h2>Lumenator</h2>
              {this.state.originalConfig &&
                this.state.originalConfig[Conf.DEVICE_NAME] && (
                  <Chip
                    text={this.state.originalConfig[Conf.DEVICE_NAME] as string}
                  ></Chip>
                )}
              <div class="version">v1.0</div>
            </div>
          </div>
        </header>
        <NavMenu
          activeId={1}
          renderActionSection={() => {
            return this.bannerService.renderActionSection();
          }}
        >
          <NavMenuTab id={1} title="Device">
            <DeviceSetup
              config={this.state.config}
              bannerService={this.bannerService}
              hardwareService={this.hardwareService}
              websocketService={this.websocketService}
              configService={this.configService}
              onConfigUpdate={(config) => {
                this.setState({
                  config: {
                    ...config,
                  },
                });
              }}
              onLoading={(loading) => {
                this.setState({ loading });
              }}
              controlMode={this.state.controlMode}
              onControlModeToggle={this.handleControlModeToggle}
            ></DeviceSetup>
          </NavMenuTab>
          <NavMenuTab id={2} title="Network">
            <NetworkSetup
              config={this.state.config}
              onConfigUpdate={(config) => {
                this.setState({
                  config: {
                    ...config,
                  },
                });
              }}
            ></NetworkSetup>
          </NavMenuTab>
          <NavMenuTab id={3} title="MQTT">
            <MQTTSetup
              config={this.state.config}
              onConfigUpdate={(config) => {
                this.setState({
                  config: {
                    ...config,
                  },
                });
              }}
            ></MQTTSetup>
          </NavMenuTab>
          <NavMenuTab id={4} title="E131">
            <E131Setup
              config={this.state.config}
              onConfigUpdate={(config) => {
                this.setState({
                  config: {
                    ...config,
                  },
                });
              }}
            ></E131Setup>
          </NavMenuTab>
          {/* TODO Bring this back when a lighter weight color picker is selected */}
          {/* <NavMenuTab id={5} title="Test">
            <ManualControl
              webSocketService={this.websocketService}
              controlMode={this.state.controlMode}
              onControlModeToggle={this.handleControlModeToggle}
              onColorSet={this.handleColorSet}
              rgbColor={this.state.rgbColor}
              whiteColor={this.state.whiteColor}
              whiteValueColor={this.state.whiteValueColor}
            ></ManualControl>
          </NavMenuTab> */}
        </NavMenu>
      </div>
    );
  }
}

export default LumenatorApp;
