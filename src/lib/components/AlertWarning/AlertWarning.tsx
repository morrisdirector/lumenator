import { Fragment, FunctionalComponent, h } from "preact";

import { IAlertWarningProps } from "./IAlertWarningProps";
import { useState } from "preact/hooks";

const AlertWarning: FunctionalComponent<IAlertWarningProps> = (props) => {
  const [closed, setClosed] = useState(false);
  return (
    <Fragment>
      {!closed && (
        <div
          class={`lum-AlertWarning${
            props.icon && props.icon.length ? " icon" : ""
          }${
            props.margin && props.margin.length ? ` margin-${props.margin}` : ""
          }`}
        >
          <div id="message" class={props.type ? props.type : "info"}>
            {props.icon && props.icon.length && (
              <span class={`icon ${props.icon}`}>
                <span></span>
              </span>
            )}
            <span class="text">{props.text}</span>
            {props.closable && (
              <button
                class="close"
                onClick={() => {
                  setClosed(true);
                }}
              >
                x
              </button>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AlertWarning;
