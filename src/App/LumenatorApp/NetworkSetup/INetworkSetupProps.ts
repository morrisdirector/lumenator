import {
  IConfigAccessPoint,
  IConfigNetwork,
} from "../../../lib/interfaces/IConfigJson";

export interface INetworkSetupProps {
  page?: "app" | "setup";
  configNetwork?: IConfigNetwork;
  configAccessPoint?: IConfigAccessPoint;
  onConfigUpdate?: (configs: {
    network: IConfigNetwork;
    accessPoint: IConfigAccessPoint;
  }) => void;
}
