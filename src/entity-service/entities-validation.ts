import {dbService, dbPathService} from '../db-service';

export class EntitiesValidation {

    db: any
    dbPathService: any

    constructor() {
        this.db = new dbService();
        this.dbPathService = new dbPathService("jxAdmin");
    }

    public isUsedFieldValid(inputId: any, name: string, currentConnectedUser: any) {
        return this.isInputExist(inputId, currentConnectedUser).then((isExist: boolean) => {
            return isExist && name;
        });
    }

    public isInputExist(inputId: any, currentConnectedUser: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser);
        return this.db.getByPath(`${basePath}/usedInputs/${inputId}`).then((snap: any) => {
            if (snap) {
                let val = snap.val();
                return val ? true : false;
            }

            return false;
        });
    }
}