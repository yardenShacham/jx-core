export class Deferred {
    promise: Promise<any>
    resolve: any
    reject: any

    constructor() {
        this.promise = new Promise((resolve: any, reject: any) => {
            this.reject = reject;
            this.resolve = resolve;
        })
    }
}