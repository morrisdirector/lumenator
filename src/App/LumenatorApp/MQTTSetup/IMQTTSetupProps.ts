import { IConfigJson } from "../../../lib/interfaces/IConfigJson";

export interface IMQTTSetupProps {
  config?: IConfigJson;
  onConfigUpdate?: (config: IConfigJson) => void;
}
