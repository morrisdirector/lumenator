import { Fragment, FunctionalComponent, h } from "preact";

import { IInputProps } from "./IInputProps";

const Input: FunctionalComponent<IInputProps> = (props) => {
  return (
    <div class="lum-Input">
      <input
        class="lum-Input-input"
        value={props.value}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          if (typeof props.onChange === "function") {
            props.onChange(value);
          }
        }}
      />
      {props.children}
    </div>
  );
};

export default Input;
