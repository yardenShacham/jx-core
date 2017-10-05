import {dbService} from '../db-service'
export class entityService {
    db: any
    appName: string
    basePath: string

    constructor() {
        this.db = new dbService();
        this.appName = "jxAdmin";
        this.basePath = this.generateBasePath();
    }

    generateBasePath() {
        let currentUserId = 1;
        return `${this.appName}/users/${currentUserId}`;
    }

    getEnteties() {
        return this.db.getByPath(`${this.basePath}/entities/allEntities`);
    }

    createEntity() {

    }

    updateEntity() {

    }

    removeEntity() {

    }
}