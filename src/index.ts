import {appConfiguration} from './app.config';

const firebase = require('firebase/app');
import {registerDependencies} from './app.dependencies.register';

export default function () {
    (<any>firebase).initializeApp(appConfiguration.firebase);

    return registerDependencies();
}
