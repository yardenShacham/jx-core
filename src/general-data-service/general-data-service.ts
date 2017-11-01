import {dbService, dbPathService} from '../db-service'

export class generalDataService {
    db: any
    dbPathService: any
    baseAppPath: string

    constructor(dbSer?: any, dbPathSer?: any) {
        this.db = dbSer ? dbSer : new dbService();
        this.dbPathService = dbPathSer ? dbPathSer : new dbPathService("jxAdmin");
        this.baseAppPath = this.dbPathService.generateBasePath();
    }

    getInputTypeEnums() {
        return this.db.getByPath(`${this.baseAppPath}/inputTypes`)
            .then((snap: any) => snap.val());
    }
}