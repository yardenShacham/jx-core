import {dbService, dbPathService} from '../db-service'

export class generalDataService {
    db: any
    dbPathService: any
    baseAppPath: string

    constructor(dbService?: any, dbPathService?: any) {
        this.db = dbService ? dbService : new dbService();
        this.dbPathService = dbPathService ? dbPathService : new dbPathService("jxAdmin");
        this.baseAppPath = this.dbPathService.generateBasePath();
    }

    getInputTypeEnums() {
        return this.db.getByPath(`${this.baseAppPath}/inputTypes`);
    }
}