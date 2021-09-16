import {
  AlertWarningIcon,
  AlertWarningType,
} from "../components/AlertWarning/IAlertWarningProps";
import { Fragment, VNode, h } from "preact";

import AlertWarning from "../components/AlertWarning/AlertWarning";
import { ILumenatorAppState } from "../../App/LumenatorApp/LumenatorApp";
import { getUniqueId } from "../utils/utils";

export interface IDialogConfig {
  id?: string;
  warningText?: string;
  warningIcon?: AlertWarningIcon;
  cancelText?: string;
  okText?: string;
  okClass?: string;
  onCancel?: () => any;
  onOk?: () => any;
}

export class BannerService {
  private _dialogConfig?: IDialogConfig | null;
  private _messages: Array<VNode<any>> = [];
  constructor(public reRender: (newState?: ILumenatorAppState) => void) {
    this.renderActionSection = this.renderActionSection.bind(this);
    this.newDialog = this.newDialog.bind(this);
  }

  public get dialogConfig(): IDialogConfig | null | undefined {
    return this._dialogConfig;
  }

  public set dialogConfig(config: IDialogConfig | null | undefined) {
    this._dialogConfig = config;
    this.reRender();
  }

  public get messages(): Array<VNode<any>> {
    return this._messages;
  }

  public set messages(messages: Array<VNode<any>>) {
    this._messages = messages;
    this.reRender();
  }

  public renderActionSection(): h.JSX.Element {
    return (
      <Fragment>
        {this.messages && !!this.messages.length && (
          <div class={`lum-messages${this.dialogConfig ? " mb-small" : ""}`}>
            {this.messages.map((msg) => msg)}
          </div>
        )}

        {this.dialogConfig && (
          <section class="action-section no-margin">
            {this.dialogConfig.warningText && (
              <div>
                <AlertWarning
                  icon={this.dialogConfig.warningIcon}
                  type={AlertWarningType.BASIC_BORDERLESS}
                  text={this.dialogConfig.warningText}
                />
              </div>
            )}
            <div>
              <button
                onClick={() => {
                  if (
                    this.dialogConfig &&
                    typeof this.dialogConfig.onCancel === "function"
                  ) {
                    this.dialogConfig.onCancel();
                  } else {
                    this.dialogConfig = null;
                  }
                }}
              >
                {this.dialogConfig.cancelText}
              </button>
              <button
                class={this.dialogConfig.okClass || "primary"}
                onClick={() => {
                  if (
                    this.dialogConfig &&
                    typeof this.dialogConfig.onOk === "function"
                  ) {
                    this.dialogConfig.onOk();
                  } else {
                    this.dialogConfig = null;
                  }
                }}
              >
                {this.dialogConfig.okText}
              </button>
            </div>
          </section>
        )}
      </Fragment>
    );
  }

  public newDialog(config: IDialogConfig): void {
    if (!this.dialogConfig || this.dialogConfig.id !== config.id) {
      this.dialogConfig = { cancelText: "Cancel", okText: "Ok", ...config };
      this.reRender();
    }
  }

  public clear(): void {
    this.dialogConfig = null;
    this.messages = [];
    this.reRender();
  }

  public addMessage(msg: VNode<any>): void {
    this.messages = [...this.messages, <div key={getUniqueId()}>{msg}</div>];
  }
}
