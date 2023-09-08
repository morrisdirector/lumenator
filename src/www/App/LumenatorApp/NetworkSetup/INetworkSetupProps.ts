import { IConfigJson } from "../../../lib/interfaces/IConfigJson";

export interface INetworkSetupProps {
  page?: "app" | "setup";
  config?: IConfigJson;
  onConfigUpdate?: (config: IConfigJson) => void;
}
