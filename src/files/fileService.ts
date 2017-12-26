import {appInjector} from '../app.dependencies.register';
import {File} from './File';

export class fileService {
    db: any
    dbPathService: any

    constructor() {
        this.db = appInjector.get('dbService');
        this.dbPathService = appInjector.get('dbPathService').init("jxAdmin");
    }

    uploadFile(file: File, folder?: string) {
        if (this.isFileValid(file)) {
            let basePath =  this.dbPathService.generateBasePathByUser();
            return basePath ?
                this.db.updateCollection(`${basePath}/files${folder ? folder : ''}`, [file]) : null;
        }
    }

    getFiles(folderPath?: string, fileId?: string) {
        let basePath =  this.dbPathService.generateBasePathByUser();
        return basePath ?
            this.db.getByPath(`${basePath}/files${folderPath ? folderPath : ''}${fileId ? '/' + fileId : ''}`)
                .then((snap: any) => snap.val()) : null;
    }


    isFileValid(file: File) {
        return file.name && this.isValidMimeType(file.mimeType) && file.content;
    }

    isValidMimeType(mimeType: string) {
        return mimeType && mimeType[0] === '.';
    }

}