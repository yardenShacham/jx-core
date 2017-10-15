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
        return this.appName;
    }
    getEnteties(currentUserId: any) {
        return this.db.getByPath(`${this.basePath}/users/${currentUserId}/entities/allEntities`).then((snap) => {
            return snap.val();
        });
    }

    createEntity() {

    }

    updateEntity() {

    }

    removeEntity() {

    }
}