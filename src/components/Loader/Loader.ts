import { CustomElement } from "../BaseComponent/BaseComponent";
import { ILoaderProps } from "./ILoaderProps";

const loaderTemplate = document.createElement("template");
loaderTemplate.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div id="ui-loader" class="ui-loader hidden">
	<div id="loader" class="loader">Loading...</div>
</div>
`;
class Loader extends CustomElement {
  constructor() {
    super(loaderTemplate);
    this.setState({
      id: this.getAttribute("id"),
      loading: this.getAttribute("loading") === "true",
      variant: this.getAttribute("variant") || "page",
    } as ILoaderProps);
  }
  updateLoadingClass(loading) {
    debugger;
    if (loading) {
      this.removeClass("hidden", "#ui-loader");
    } else {
      this.addClass("hidden", "#ui-loader");
    }
  }
  onStateChanges = (state, previous) => {
    debugger;
    console.log("state changes: ", state, previous);
    this.updateLoadingClass(state.loading);
    if (!previous.variant || state.variant !== previous.variant) {
      this.removeClass("page", "#ui-loader");
      this.removeClass("container", "#ui-loader");
      this.addClass(state.variant, "#ui-loader");
    }
  };
}
window.customElements.define("ui-loader", Loader);
