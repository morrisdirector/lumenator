import { Fragment, FunctionalComponent, h } from "preact";

import { INavMenuProps } from "./INavMenuProps";
import { INavMenuTabProps } from "../NavMenuTab/INavMenuTabProps";
import preact from "preact";
import { useState } from "preact/hooks";

const NavMenu: FunctionalComponent<INavMenuProps> = (props) => {
  const [activeTabId, setActiveTabId] = useState(props.activeId || 0);

  const renderTabs = (): any => {
    if (Array.isArray(props.children)) {
      return props.children.map((child) => {
        const props = (child as preact.VNode<INavMenuTabProps>).props;
        const active =
          (child as preact.VNode<INavMenuTabProps>).props.id === activeTabId;
        return (
          <li
            class={"tab" + (active ? " active" : "")}
            onClick={() => {
              setActiveTabId(
                (child as preact.VNode<INavMenuTabProps>).props.id
              );
            }}
          >
            {props.title}
          </li>
        );
      });
    } else if ((props.children as preact.VNode<INavMenuTabProps>).props) {
      return (
        <li class="tab active">
          {(props.children as preact.VNode<INavMenuTabProps>).props.title}
        </li>
      );
    }
  };

  const renderTabContent = (): preact.ComponentChild => {
    if (Array.isArray(props.children)) {
      return props.children.find(
        (child) =>
          (child as preact.VNode<INavMenuTabProps>).props.id === activeTabId
      );
    } else if ((props.children as preact.VNode<INavMenuTabProps>).props) {
      return props.children;
    }
  };

  return (
    <Fragment>
      <div class="lum-Nav">
        <ul class="lum-NavMenu">{renderTabs()}</ul>
      </div>
      <main>{renderTabContent()}</main>
    </Fragment>
  );
};

export default NavMenu;
