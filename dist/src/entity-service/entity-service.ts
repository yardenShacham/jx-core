import {appInjector} from '../app.dependencies.register';
import {isString} from 'lodash';
import {EntitiesValidation} from './entities-validation';

export class entityService {
    db: any
    dbPathService: any
    entityValidationService: any
    generalDataService: any
    inputTypeEnum: any

    constructor() {
        this.dbPathService = appInjector.get('dbPathService').init('jxAdmin');
        this.db = appInjector.get('dbService');
        this.entityValidationService = appInjector.get('entitiesValidationService');
        new EntitiesValidation();
        this.generalDataService = appInjector.get('generalDataService');
    }


    getUsedInputs() {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ? this.db.getByPath(`${basePath}/usedInputs`).then((snap: any) => snap.val()) : null;
    }

    getInputTypeEnum() {
        if (this.inputTypeEnum)
            return Promise.resolve(this.inputTypeEnum);
        else {
            return this.generalDataService.getInputTypeEnums()
                .then((inputTypesEnum: any) => {
                    this.inputTypeEnum = inputTypesEnum;
                    return this.inputTypeEnum;
                });
        }
    }

    getUsedFields() {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ? this.db.getByPath(`${basePath}/usedFields`).then((snap: any) => snap.val()) : null;
    }

    getEnteties() {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.getByPath(`${basePath}/entities/allEntities`).then((snap: any) => snap.val()) : null;
    }

    getEntityById(id: any) {
        let basePath = this.dbPathService.generateBasePathByUser();
        if (!basePath)
            return Promise.resolve(null);

        return Promise.all([this.getUsedInputs(),
            this.getUsedFields(),
            this.db.getByPath(`${basePath}/entities/allEntities/${id}`).then((snap: any) => snap.val())]).then((responses: any[]) => {
            let usedInputs = responses[0];
            let usedFields = responses[1];
            let entity = responses[2];
            let allFields = entity.fields ? responses[2].fields : [];

            let fields = allFields.map((fieldId: any) => {
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
            entity.fields = fields;
            return entity;
        });
    }

    createEntity(entity: any) {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.updateCollection(`${basePath}/entities/allEntities`, [entity]) : null;
    }

    createNewUserInput(inputType: any, description: string) {
        let basePath = this.dbPathService.generateBasePathByUser();
        return this.db.updateCollection([{
            inputType,
            description
        }], `${basePath}/usedInputs`);
    }

    updateEntity(entityId: any, entityInfo: any) {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.updateProp(`${basePath}/entities/allEntities/${entityId}/name`, entityInfo.name) : null;
    }

    removeEntity(entityId: any) {
        let basePath = this.dbPathService.generateBasePathByUser();
        if (!basePath)
            return null;

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

    removeEntiyWithoutFields(entityId: any) {
        let basePath = this.dbPathService.generateBasePathByUser();

        return basePath ? this.db.remove(`${basePath}/entities/allEntities/${entityId}`) : null;
    }

    addNewField(entityId: any, fieldName: string, inputType: any) {
        let ref = this.getBaseRef();
        let basePath = this.dbPathService.generateBasePathByUser();
        if (!ref || !basePath)
            return null;

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

    addNewUsedInput(inputType: any, ref: any, usedInputPath: string) {
        let usedInputsRef = ref.child('usedInputs');
        return usedInputsRef.orderByChild('inputType').equalTo(inputType).once('value')
            .then((snap: any) => {
                let value = snap.val();
                if (!value) {
                    return this.db.updateCollection(usedInputPath, [{
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

    getBaseRef() {
        let basePath = this.dbPathService.generateBasePathByUser();
        return basePath ? this.dbPathService.getDbManager().ref(basePath) : null;
    }
}
