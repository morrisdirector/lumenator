import { FunctionalComponent, h } from "preact";

import { IChipProps } from "./IChipProps";

const Chip: FunctionalComponent<IChipProps> = ({
  variant = "primary",
  margin = false,
  ...props
}) => {
  return (
    <div class={`lum-Chip ${variant}${margin ? " margin-small" : ""}`}>
      {props.text || props.children}
    </div>
  );
};

export default Chip;
