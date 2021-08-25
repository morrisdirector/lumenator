import { h } from "preact";

export interface INavMenuProps {
  /**
   * Tab ID that is active on load
   */
  activeId?: number;
  renderMessages?(): h.JSX.Element;
  renderActionSection?(): h.JSX.Element;
}
