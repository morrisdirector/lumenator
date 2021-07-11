import { FunctionalComponent, h } from "preact";

import { INavMenuTabProps } from "./INavMenuTabProps";

const NavMenuTab: FunctionalComponent<INavMenuTabProps> = (props) => {
  return <div>{props.children}</div>;
};

export default NavMenuTab;
