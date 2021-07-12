import { MarginType } from "../../enums/MarginType";

export enum AlertWarning {
  INFO = "info",
  ALERT = "alert",
  DANGER = "danger",
}

export interface IAlertWarningProps {
  text?: string;
  showIcon?: boolean;
  type?: AlertWarning;
  closable?: boolean;
  margin?: MarginType;
}
