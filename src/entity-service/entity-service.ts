import {dbService, dbPathService} from '../db-service';
import {isString} from 'lodash';
import {generalDataService} from '../general-data-service';
import {EntitiesValidation} from './entities-validation';

export class entityService {
    db: any
    dbPathService: any
    entityValidationService: any
    generalDataService: any
    inputTypeEnum: any

    constructor(private currentConnectedUser: any) {
        this.db = new dbService();
        this.dbPathService = new dbPathService("jxAdmin");
        this.entityValidationService = new EntitiesValidation(currentConnectedUser);
        this.generalDataService = new generalDataService(dbService, dbPathService);
        this.generalDataService.getInputTypeEnums().then((inputTypesEnum: any) => this.inputTypeEnum = inputTypesEnum)
    }

    getUsedInputs(currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.getByPath(`${basePath}/usedInputs`);
    }

    getUsedFields(currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.getByPath(`${basePath}/usedFields`);
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

    createEntity(entity: any, currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.updateCollection(`${basePath}/entities/allEntities`, [entity]);
    }

    updateEntity(entityId: any, entityInfo: any, currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.db.updateProp(`${basePath}/entities/allEntities/${entityId}/name`, entityInfo.name);
    }

    removeEntity(entityId: any, currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        let entityPath = `${basePath}/entities/allEntities/${entityId}`;

        return this.db.getByPath(entityPath).then((entity: any) => {
            return this.removeFields(basePath, entity.fields);
        });
    }

    removeFields(basePath: string, fields: any[]) {
        let tasks: any[] = [];
        for (let i = 0; i < fields.length; i++) {
            tasks.push(this.db.remove(`${basePath}/usedFields/${fields[i]}`));
        }

        return Promise.all(tasks);
    }

    removeEntiyWithoutFields(entityId: any, currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);

        return this.db.getByPath(`${basePath}/entities/allEntities/${entityId}`);
    }

    addNewField(entityId: any, fieldName: string, inputType: any, currentConnectedUser?: any) {
        let ref = this.getBaseRef(currentConnectedUser);
        let basePath = this.getBasePath(currentConnectedUser);
        let usedInputPath = `${basePath}/usedInputs`;
        return this.addNewUsedInput(inputType, ref, usedInputPath).then((addedCollection: any[]) => {
            let inputId = addedCollection[0];
            if (inputId) {
                return this.addNewUsedField(inputId, fieldName, usedInputPath).then((addedFieldCollection: any[]) => {
                    let fieldId = addedFieldCollection[0];
                    if (fieldId) {
                        let fieldsPath = `${basePath}/entities/allEntities/${entityId}/fields`;
                        return this.db.getByPath(fieldsPath).then((fields: any[]) => {
                            fields.push(fieldId);
                            return this.db.setByPath(fieldsPath, fields);
                        });
                    }
                });
            }
        });
    }

    addNewUsedInput(inputType: any, ref: any, usedInputPsth: string) {
        let usedInputsRef = ref.child('usedInputs');
        return usedInputsRef.orderByChild('inputType').equalTo(inputType).once('value').then((snap: any) => {
            let value = snap.val();
            if (!value) {
                return this.db.updateCollection(usedInputPsth, [{
                    inputType: inputType
                }], usedInputsRef);
            }
        });
    }

    addNewUsedField(inputId: any, name: string, basePath: string) {
        return new Promise((resolve: any, reject: any) => {
            this.entityValidationService.isUsedFieldValid.then((isValid: boolean) => {
                if (isValid) {
                    this.db.updateCollection([{
                        inputId,
                        name
                    }], `${basePath}/usedFields`).then(() => resolve());
                }
                else {
                    reject();
                }
            });
        });
    }

    getBaseRef(currentConnectedUser?: any) {
        let basePath = this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
        return this.dbPathService.getDbManager().ref(basePath);
    }

    getBasePath(currentConnectedUser?: any) {
        return this.dbPathService.generateBasePathByUser(currentConnectedUser ? currentConnectedUser : this.currentConnectedUser);
    }
}
