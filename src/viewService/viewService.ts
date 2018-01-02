import {appInjector} from '../app.dependencies.register';

export class viewService {
    db: any
    dbPathService: any

    constructor() {
        this.db = appInjector.get('dbService');
        this.dbPathService = appInjector.get('dbPathService').init('jxAdmin');
    }

    getViews() {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.getByPath(`${basePath}/views`).then((snap: any) => snap.val()) : Promise.resolve(null);
    }

    getViewById(id: string) {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.getByPath(`${basePath}/views/${id}`).then((snap: any) => snap.val()) : Promise.resolve(null);
    }

    createView(name: string, relatedEnitities: string[]) {
        if (name && relatedEnitities && relatedEnitities.length && relatedEnitities.length > 0) {
            let basePath = this.dbPathService.generateBasePathByUser();
            return basePath ?
                this.db.updateCollection([{
                    name,
                    relatedEnitities,
                    content: {}
                }], `${basePath}/views`) : Promise.resolve(null);
        }
        return Promise.reject("name or related entities does not exist!!!");
    }

    changeViewName(viewId: string, viewName: string) {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.updateProp(`${basePath}/views/${viewId}/name`, viewName) : Promise.resolve(null);
    }

    setBackground(fileId: string) {

    }

    isBackgroundExist(fileId: string) {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.getByPath(`${basePath}/files/${fileId}`)
                .then((snap: any) => !!snap.val()) : Promise.resolve(null);
    }

    removeView(viewId: string) {
        let basePath = this.dbPathService.generateBasePathByUser();

        return basePath ? this.db.remove(`${basePath}/views/${viewId}`) : null;
    }
}