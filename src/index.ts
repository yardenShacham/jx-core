import {appConfiguration} from './app.config';

const firebase = require('firebase/app');
(<any>firebase).initializeApp(appConfiguration.firebase);

export {entityService} from './entity-service';
export {authService} from './auth-service';