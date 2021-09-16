import { FunctionalComponent, h } from "preact";

import { IProgressProps } from "./IProgressProps";

const Progress: FunctionalComponent<IProgressProps> = ({
  progress = 0,
  ...props
}) => {
  return (
    <div class="lum-Progress">
      <div class="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default Progress;
