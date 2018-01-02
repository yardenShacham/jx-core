import {appInjector} from '../app.dependencies.register';

export class dbPathService {
    appName: string

    init(appName: string) {
        this.appName = appName;
        return this;
    }

    generateBasePathByUser() {
        let currentUser = appInjector.get('authService').getCurrentUser();
        return currentUser ? `${this.appName}/users/${currentUser.uid}` : null;
    }

    generateBasePath() {
        return `${this.appName}`;
    }
}