const db = require('firebase/database');

export class dbService {
    fireDbService: any

    constructor() {
        this.fireDbService = db();
    }

    getByPath(path: string) {
        return this.fireDbService.ref(path).once('value');
    }

}