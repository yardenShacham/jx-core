import {appInjector} from '../app.dependencies.register';

export class viewService {
    db: any
    dbPathService: any
    currentConnectedUser: any

    constructor() {
        this.db = appInjector.get('dbService');
        this.dbPathService = appInjector.get('dbPathService').init('jxAdmin');
    }

    initConnetedUser(currentConnectedUser: any) {
        this.currentConnectedUser = currentConnectedUser;
    }


    getViews() {
        let basePath = this.getBasePath();
        return basePath ?
            this.db.getByPath(`${basePath}/views`).then((snap: any) => snap.val()) : null;
    }

    getViewById(id: string) {
        let basePath = this.getBasePath();
        return basePath ?
            this.db.getByPath(`${basePath}/views/${id}`).then((snap: any) => snap.val()) : null;
    }

    createView(name: string, relatedEnitities: string[]) {
        if (name && relatedEnitities && relatedEnitities.length && relatedEnitities.length > 0) {
            let basePath = this.getBasePath();
            return basePath ?
                this.db.updateCollection(`${basePath}/views`, [{
                    name,
                    relatedEnitities,
                    content: {}
                }]) : null;
        }
        return Promise.reject("name or related entities does not exist!!!");
    }

    changeViewName(viewId: string, viewName: string) {
        let basePath = this.getBasePath();
        return basePath ?
            this.db.updateProp(`${basePath}/views/${viewId}/name`, viewName) : null;
    }

    setBackground(fileId: string) {

    }

    isBackgroundExist(fileId: string) {
        let basePath = this.getBasePath();
        return basePath ?
            this.db.getByPath(`${basePath}/files/${fileId}`)
                .then((snap: any) => !!snap.val()) : false;
    }

    removeView(viewId: string) {
        let basePath = this.getBasePath();

        return basePath ? this.db.remove(`${basePath}/views/${viewId}`) : null;
    }

    getBasePath() {
        return this.currentConnectedUser ?
            this.dbPathService.generateBasePathByUser(this.currentConnectedUser.uid) : null;
    }
}
