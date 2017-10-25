const firebase = require('firebase');

export class dbService {
    fireDbService: any

    constructor() {
        this.fireDbService = firebase.database();
    }

    getByPath(path: string) {
        return this.fireDbService.ref(path).once('value');
    }

    setByPath(path: string, obj: any) {
        return this.fireDbService.ref(path).set(obj);
    }

    updateCollection(collectionPath: string, newCollection: any[]) {
        let updates: any = {};

        function addItemToUpdate(key: any, data: any) {
            updates[`${collectionPath}/${key}`] = data;
        }

        let ref = this.fireDbService.ref(collectionPath);
        for (let i = 0; i < newCollection.length; i++) {
            let key = ref.push().key;
            addItemToUpdate(key, newCollection[i]);
        }

        return this.fireDbService.ref().update(updates);
    }

    updateProp(path: string, val: any) {
        return this.fireDbService.ref().update({
            [path]: val
        });
    }

    remove(path: string) {
        return this.fireDbService.ref(path).remove();
    }

    getDbManager() {
        return this.fireDbService;
    }

}