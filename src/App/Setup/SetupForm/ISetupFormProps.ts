import { IConfigJson } from "../../../lib/interfaces/IConfigJson";

export interface ISetupFormProps {
  config?: IConfigJson;
  onConfigUpdate?: (config: IConfigJson) => void;
  onDisabledChange?: (disabled: boolean) => void;
}
