import { Fragment, FunctionalComponent, h } from "preact";

import { IInputProps } from "./IInputProps";
import { strValToNumber } from "../../utils/utils";

const Input: FunctionalComponent<IInputProps> = (props) => {
  return (
    <div class="lum-Input">
      <input
        type={props.type}
        class="lum-Input-input"
        value={props.value}
        onChange={(event) => {
          const strValue = (event.target as HTMLSelectElement)?.value;
          const val =
            props.type === "number" ? strValToNumber(strValue) : strValue;
          if (typeof props.onChange === "function") {
            props.onChange(val);
          }
        }}
      />
      {props.children}
    </div>
  );
};

export default Input;
