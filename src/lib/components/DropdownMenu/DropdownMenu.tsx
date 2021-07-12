import { Fragment, FunctionalComponent, h } from "preact";

import { IDropdownMenuProps } from "./IDropdownMenuProps";

const DropdownMenu: FunctionalComponent<IDropdownMenuProps> = (props) => {
  return (
    <div class="lum-DropdownMenu">
      <select>{props.children}</select>
      <div class="dropdown-indicator" />
    </div>
  );
};

export default DropdownMenu;
