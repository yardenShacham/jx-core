import {dbService, dbPathService} from '../db-service';
import {generalDataService} from '../general-data-service';

export class entityService {
    db: any
    dbPathService: any
    generalDataService: any
    inputTypeEnum: any

    constructor(private currentConnectedUser: any) {
        this.db = new dbService();
        this.dbPathService = new dbPathService("jxAdmin");
        this.generalDataService = new generalDataService(dbService, dbPathService);
        this.generalDataService.getInputTypeEnums().then((inputTypesEnum: any) => this.inputTypeEnum = inputTypesEnum)
    }


    getEnteties(currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.getByPath(`${basePath}/entities/allEntities`);
    }

    getEntityById(id: any, currentConnectedUser?: any) {
        let user = currentConnectedUser ? currentConnectedUser : this.currentConnectedUser;
        let basePath = this.dbPathService.generateBasePathByUser(user);
        return Promise.all([this.getUsedInputs(user), this.getUsedFields(user), this.db.getByPath(`${basePath}/entities/allEntities/${id}`)]).then((responses: any[]) => {
            let usedInputs = responses[0];
            let usedFields = responses[1];
            let allFields = responses[2];

            let fields = allFields.fields.map((fieldId: any) => {
                let field = usedFields[fieldId];
                let input = usedInputs[field.inputId];
                return {
                    fieldId: fieldId,
                    input: {
                        inputId: field.inputId,
                        inputType: this.inputTypeEnum[input.inputType]
                    },
                    name: field.name
                }
            });
        });
    }


    getUsedInputs(currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.getByPath(`${basePath}/usedInputs`);
    }

    getUsedFields(currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.getByPath(`${basePath}/usedFields`);
    }

    createEntity(entity: any, currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.updateCollection(`${basePath}/entities/allEntities`, [entity]);
    }

    updateEntity(entityId: any, entityInfo: any, currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.updateProp(`${basePath}/entities/allEntities/${entityId}/name`, entityInfo.name);
    }

    addNewField(fieldName: string, inputType: any, currentConnectedUser?: any) {
        let ref = this.getBaseRef(currentConnectedUser);
        let path = `${this.getBasePath(currentConnectedUser)}/usedInputs`
        this.addNewUsedInput(inputType, ref);
    }

    addNewUsedInput(inputType: any, ref: any, path: any) {
        ref.child('usedInputs').orderByChild('inputType').equalTo(inputType).once('value').then((snap: any) => {
            let value = snap.val();
            if (!value) {
                this.db.updateCollection()
            }
        });
    }


    addNewUsedField(fieldId: any, inputId: any, name: string, basePath: string) {

    }

    removeEntity() {

    }

    getBaseRef(currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.dbPathService.getDbManager().ref(basePath);
    }

    getBasePath(currentConnectedUser?: any) {
        return this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
    }
}
