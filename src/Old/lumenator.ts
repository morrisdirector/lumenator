import '../components/index';
import { LumenatorApp } from './lumenator-app';
import { LumenatorSetup } from './lumenator-setup';

// Development Mode
const DEVELOPMENT = process.env.NODE_ENV === 'development';

const PAGE = document.body.id === 'lumenator-setup' ? 'setup' : 'app';

const init = () => {
	let controller;
	if (PAGE === 'app') {
		controller = new LumenatorApp(DEVELOPMENT);
	} else {
		controller = new LumenatorSetup(DEVELOPMENT);
	}
};

init();
