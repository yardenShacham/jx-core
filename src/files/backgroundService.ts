import {appInjector} from '../app.dependencies.register';
import {File} from './File';

export class backgroundService {
    fileService: any;
    floderPath: string = "/background";

    constructor() {
        this.fileService = appInjector.get('fileService');
    }

    uploadBackground(img: File) {
        return this.isBackgroundImageValid(img) ?
            this.fileService.uploadFile(img, this.floderPath) : Promise.reject("img is not valid")
    }

    getBackgrounds() {
        return this.fileService.getFiles(this.floderPath);
    }

    getBackgroundById(fileId: string) {
        return this.fileService.getFiles(this.floderPath, fileId);
    }

    isBackgroundImageValid(img: File) {
        return (/image\/(gif|jpg|jpeg|tiff|png)$/i).test(img.mimeType);
    }
}