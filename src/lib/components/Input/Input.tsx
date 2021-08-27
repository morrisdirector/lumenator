import { FunctionalComponent, h } from "preact";

import { IInputProps } from "./IInputProps";
import { strValToNumber } from "../../utils/utils";

const Input: FunctionalComponent<IInputProps> = (props) => {
  const getEventValue = (event: Event): number | string | undefined => {
    const strValue = (event.target as HTMLInputElement).value;
    return props.type === "number" ? strValToNumber(strValue) : strValue;
  };

  const handleChange = (event: Event): void => {
    const val = getEventValue(event);
    if (typeof props.onChange === "function") {
      props.onChange(val);
    }
  };

  const handleBlur = (event: Event): void => {
    const val = getEventValue(event);
    if (typeof props.onBlur === "function") {
      props.onBlur(val);
    }
  };

  return (
    <div class={`lum-Input${props.disabled ? " disabled" : ""}`}>
      <input
        disabled={props.disabled}
        type={props.type}
        class="lum-Input-input"
        value={props.value}
        onInput={handleChange}
        onBlur={handleBlur}
      />
      {props.children}
    </div>
  );
};

export default Input;
