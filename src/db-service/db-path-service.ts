export class dbPathService {

    constructor(private appName: string) {

    }

    generateBasePathByUser(currentUserId: any) {
        return `${this.appName}/users/${currentUserId}`;
    }

    generateBasePath() {
        return `${this.appName}`;
    }
}