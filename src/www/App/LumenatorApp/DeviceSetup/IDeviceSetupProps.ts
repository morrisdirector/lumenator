import { BannerService } from "../../../lib/services/banner-service";
import { ConfigService } from "../../../lib/services/config-service";
import { ControlMode } from "../../../lib/enums/ControlMode";
import { HardwareService } from "../../../lib/services/hardware-service";
import { IConfigJson } from "../../../lib/interfaces/IConfigJson";
import { WebsocketService } from "../../../lib/services/websocket-service";

export interface IDeviceSetupProps {
  config?: IConfigJson;
  controlMode?: ControlMode;
  bannerService?: BannerService;
  hardwareService?: HardwareService;
  websocketService?: WebsocketService;
  configService?: ConfigService;
  onControlModeToggle?: (controlMode: ControlMode) => void;
  onConfigUpdate?: (config: IConfigJson) => void;
  onLoading?: (loading: boolean) => void;
}
