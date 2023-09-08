import { AlertWarningType, IAlertWarningProps } from "./IAlertWarningProps";
import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";

const AlertWarning: FunctionalComponent<IAlertWarningProps> = ({
  closable = false,
  autoClose = false,
  type = AlertWarningType.INFO,
  icon,
  margin,
  text,
  autoCloseDuration = 5,
  ...props
}) => {
  const [closed, setClosed] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (autoClose && !autoCloseTimer) {
      setAutoCloseTimer(
        setTimeout(() => {
          setClosed(true);
        }, autoCloseDuration * 1000)
      );
    }
  }, [autoClose, autoCloseDuration]);

  return (
    <Fragment>
      {!closed && (
        <div
          class={`lum-AlertWarning${icon && icon.length ? " icon" : ""}${
            margin && margin.length ? ` margin-${margin}` : ""
          }${autoClose ? ` autoClose` : ""}`}
        >
          <div id="message" class={type}>
            {autoClose && (
              <div
                class="timeout-indicator"
                style={{ animationDuration: autoCloseDuration + "s" }}
              ></div>
            )}
            {icon && icon.length && (
              <span class={`icon ${icon}`}>
                <span></span>
              </span>
            )}
            <span class="text">{text}</span>
            {closable && (
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
