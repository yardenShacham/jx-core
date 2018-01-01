import {appInjector} from '../app.dependencies.register';

export class generalDataService {
    db: any
    dbPathService: any
    baseAppPath: string

    constructor(dbSer: any, dbPathSer: any) {
        this.db = appInjector.get('dbService');
        this.dbPathService = appInjector.get('dbPathService').init("jxAdmin");
        this.baseAppPath = this.dbPathService.generateBasePath();
    }

    getInputTypeEnums() {
        return this.db.getByPath(`${this.baseAppPath}/inputTypes`)
            .then((snap: any) => snap.val());
    }
}