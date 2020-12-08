import { h, render } from 'preact';
import { Card } from './Main/Main';

import './style.scss';

const App = () => <div id="lumenator-app"></div>;

render(<App />, document.getElementById('root'));