import { Fragment, FunctionalComponent, createRef, h } from "preact";
import { useEffect, useState } from "preact/hooks";

import { INavMenuProps } from "./INavMenuProps";
import { INavMenuTabProps } from "../NavMenuTab/INavMenuTabProps";
import preact from "preact";

const NavMenu: FunctionalComponent<INavMenuProps> = (props) => {
  const pushDownContainer = createRef();
  const [activeTabId, setActiveTabId] = useState(props.activeId || 0);
  const [pushDownHeight, setPushDownHeight] = useState(0);

  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.contentBoxSize) {
        // Firefox implements `contentBoxSize` as a single content rect, rather than an array
        const contentBoxSize = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize;
        if (contentBoxSize.blockSize != pushDownHeight) {
          setPushDownHeight(contentBoxSize.blockSize);
        }
      } else {
        setPushDownHeight(0);
      }
    }
  });

  useEffect(() => {
    if (pushDownContainer.current) {
      resizeObserver.observe(pushDownContainer.current);
    }
  }, [pushDownContainer]);

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
      <div
        class="lum-Nav-pushDown"
        style={{ visibility: !pushDownHeight ? "hidden" : "visible" }}
      >
        <div class="lum-Nav-pushDown-content" ref={pushDownContainer}>
          {typeof props.renderMessages === "function" && props.renderMessages()}
          {typeof props.renderActionSection === "function" &&
            props.renderActionSection()}
        </div>
      </div>
      <main>
        <div
          class="pushDown-spacer"
          style={{ height: pushDownHeight, marginBottom: "10px" }}
        ></div>
        {renderTabContent()}
      </main>
    </Fragment>
  );
};

export default NavMenu;
