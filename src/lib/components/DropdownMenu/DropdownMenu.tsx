import { Fragment, FunctionalComponent, h } from "preact";

import { IDropdownMenuProps } from "./IDropdownMenuProps";
import { useState } from "preact/hooks";

const DropdownMenu: FunctionalComponent<IDropdownMenuProps> = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.value);

  return (
    <div class="lum-DropdownMenu">
      <select
        value={props.value}
        class={
          props.placeholder &&
          props.value === undefined &&
          selectedValue === undefined
            ? "placeholder"
            : ""
        }
        onChange={(event) => {
          const strValue = (event.target as HTMLSelectElement)?.value;
          let val: string | number | undefined = strValue;
          if (props.type === "number") {
            if (strValue === "0") {
              val = 0;
            } else {
              val = parseFloat(strValue);
            }
          }
          setSelectedValue(val);
          if (typeof props.onSelect === "function") {
            props.onSelect(val);
          }
        }}
      >
        {props.placeholder && (
          <Fragment>
            <option value="" disabled selected>
              {props.placeholder}
            </option>
            <option value="" disabled>
              ---------------------------
            </option>
          </Fragment>
        )}
        {props.children}
      </select>
      <div class="dropdown-indicator" />
    </div>
  );
};

export default DropdownMenu;
