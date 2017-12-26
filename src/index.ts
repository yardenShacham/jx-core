import {appConfiguration} from './app.config';

const firebase = require('firebase/app');
import {registerDependencies} from './app.dependencies.register';

export {errorCodes, lifeStyleMethods} from './auth-service';

export function getInjector() {
    (<any>firebase).initializeApp(appConfiguration.firebase);

    return registerDependencies();
}
