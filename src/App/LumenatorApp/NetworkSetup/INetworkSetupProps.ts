import { IConfigNetwork } from "../../../lib/interfaces/IConfigJson";

export interface INetworkSetupProps {
  config?: IConfigNetwork;
  onConfigUpdate?: (config: IConfigNetwork) => void;
}
