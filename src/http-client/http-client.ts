import * as request from 'request';

export class HttpClient {
    getData(uri: string): any {
        return new Promise((resolve: any, reject: any) => {
            request({
                method: "GET",
                uri: uri
            }).on("response", (response) => {
                resolve(response);
            }).on("error", (error) => {
                reject(error);
            });
        });
    }

    postData(uri: string, body: string) {
        return new Promise((resolve: any, reject: any) => {
            request({
                method: "POST",
                uri: uri,
                body: body
            }).on("response", (response) => {
                resolve(response);
            }).on("error", (error) => {
                reject(error);
            });
        });
    }

    putData(uri: string, body: any) {
        return new Promise((resolve: any, reject: any) => {
            request({
                method: "PUT",
                uri: uri,
                body: body
            }).on("response", (response) => {
                resolve(response);
            }).on("error", (error) => {
                reject(error);
            });
        });
    }

    removeData(uri: string) {
        return new Promise((resolve: any, reject: any) => {
            request({
                method: "DELETE",
                uri: uri
            }).on("response", (response) => {
                resolve(response);
            }).on("error", (error) => {
                reject(error);
            });
        });
    }


}