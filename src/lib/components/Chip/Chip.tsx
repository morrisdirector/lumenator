import { FunctionalComponent, h } from "preact";

import { IChipProps } from "./IChipProps";

const Chip: FunctionalComponent<IChipProps> = (props) => {
  return <div class="lum-Chip">{props.text || props.children}</div>;
};

export default Chip;
