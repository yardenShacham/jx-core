interface resolveFunction {

}
interface rejectFunction {

}

export class Deferred {
    promise: Promise
    resolve: resolveFunction
    reject: rejectFunction

    constructor() {
        this.promise = new Promise((resolve: resolveFunction, reject: rejectFunction) => {
            this.reject = reject;
            this.resolve = resolve;
        })
    }
}