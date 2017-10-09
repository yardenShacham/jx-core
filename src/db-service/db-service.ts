const firebase = require('firebase');

export class dbService {
    fireDbService: any

    constructor() {
        this.fireDbService = firebase.database();
    }

    getByPath(path: string) {
        return this.fireDbService.ref(path).once('value');
    }

}