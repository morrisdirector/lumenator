import { FunctionalComponent, h } from "preact";

import { ILoaderProps } from "./ILoaderProps";

const Loader: FunctionalComponent<ILoaderProps> = ({
  variant = "page",
  ...props
}) => {
  return (
    <div id="lum-loader" class={`lum-loader ${variant}`}>
      <div id="loader" class="loader">
        Loading...
      </div>
    </div>
  );
};

export default Loader;
