import { h, FunctionComponent, Fragment } from "preact";
import { useState } from 'preact/hooks';

export const Router: FunctionComponent = () => {

  const [loading, setLoading] = useState(true);


  return (
    <> {loading ? <div id="hi">Loading</div> : <div>Not loading</div> }

    </>
  );
};