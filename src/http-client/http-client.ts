export class HttpClient {
    getData(uri: string): any {
        return fetch(uri);
    }

    postData(uri: string, body: string) {
        return fetch(uri, {
            method: "POST",
            body: body
        });
    }

    putData(uri: string, body: any) {
        return fetch(uri, {
            method: "PUT",
            body: body
        });
    }

    removeData(uri: string) {
        return fetch(uri, {
            method: "DELETE",
        });
    }


}