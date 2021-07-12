import { Fragment, FunctionalComponent, h } from "preact";

import { IInputProps } from "./IInputProps";

const Input: FunctionalComponent<IInputProps> = (props) => {
  return (
    <div class="lum-Input">
      <input class="lum-Input-input" />
      {props.children}
    </div>
  );
};

export default Input;
