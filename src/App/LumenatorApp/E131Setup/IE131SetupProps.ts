import { IConfigJson } from "../../../lib/interfaces/IConfigJson";

export interface IE131SetupProps {
  config?: IConfigJson;
  onConfigUpdate?: (config: IConfigJson) => void;
}
