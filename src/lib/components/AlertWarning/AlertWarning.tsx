import { Fragment, FunctionalComponent, h } from "preact";

import { IAlertWarningProps } from "./IAlertWarningProps";
import { useState } from "preact/hooks";

const AlertWarning: FunctionalComponent<IAlertWarningProps> = (props) => {
  const [closed, setClosed] = useState(false);
  return (
    <Fragment>
      {!closed && (
        <div class="lum-AlertWarning">
          <div id="message" class="info">
            {props.showIcon && <span class="icon">i</span>}
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
