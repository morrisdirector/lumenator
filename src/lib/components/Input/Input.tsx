import { FunctionalComponent, h } from "preact";

import { IInputProps } from "./IInputProps";
import { strValToNumber } from "../../utils/utils";

const Input: FunctionalComponent<IInputProps> = (props) => {
  const handleChange = (event: Event): void => {
    const strValue = (event.target as HTMLInputElement).value;
    const val = props.type === "number" ? strValToNumber(strValue) : strValue;
    if (typeof props.onChange === "function") {
      props.onChange(val);
    }
  };

  return (
    <div class="lum-Input">
      <input
        type={props.type}
        class="lum-Input-input"
        value={props.value}
        onInput={handleChange}
      />
      {props.children}
    </div>
  );
};

export default Input;
