import {injector} from 'jx-injector';
import {authService} from './auth-service';
import {dbPathService, dbService} from './db-service';
import {HttpClient} from './http-client';
import {generalDataService} from './general-data-service';
import {EntitiesValidation, entityService} from './entity-service';
import {fileService, backgroundService} from './files';

export const appInjector = new injector();

export function registerDependencies() {
    return new Promise((resolve: any, reject: any) => {
        if (appInjector) {
            appInjector.registerSingleton("authService", authService);
            appInjector.registerSingleton("dbPathService", dbPathService);
            appInjector.registerSingleton("dbService", dbService);
            appInjector.registerSingleton("httpClient", HttpClient);
            appInjector.registerSingleton("generalDataService", generalDataService);
            appInjector.registerSingleton("entitiesValidationService", EntitiesValidation);
            appInjector.registerSingleton("entityService", entityService);
            appInjector.registerSingleton("fileService", fileService);
            appInjector.registerSingleton("backgroundService", backgroundService);
            resolve(appInjector);
        }
        else {
            reject("rejector has does not exsit or have some problems");
        }
    });
}