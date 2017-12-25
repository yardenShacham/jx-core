import {dbService, dbPathService} from '../db-service';
import {File} from './File';

export class fileService {
    db: any
    dbPathService: any
    currentConnectedUser: any

    constructor() {
        this.db = new dbService();
        this.dbPathService = new dbPathService("jxAdmin");
    }

    initConnetedUser(currentConnectedUser: any) {
        this.currentConnectedUser = currentConnectedUser;
    }

    uploadFile(file: File) {
        if (this.isFileValid(file)) {

        }
    }

    isFileValid(file: File) {
        return file.name && this.isValidMimeType(file.mimeType) && file.content;
    }

    isValidMimeType(mimeType: string) {
        return mimeType && mimeType[0] === '.';
    }


    getBasePath() {
        return this.currentConnectedUser ?
            this.dbPathService.generateBasePathByUser(this.currentConnectedUser.uid) : null;
    }
}