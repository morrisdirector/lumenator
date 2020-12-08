import { h, FunctionComponent } from "preact";

export const Card: FunctionComponent<{ title: string }> = ({ title, children }) => {
  return (
    <div class="card">
      <h1>{title}</h1>
      {children}
    </div>
  );
};