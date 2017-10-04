import {appConfiguration} from '../app.config';

const firebase = require('firebase/app');
const auth = require("firebase/auth");

export class authService {
    signInPromise: any
    signOutPromise: any

    constructor() {
        (<any>firebase).initializeApp(appConfiguration.firebase);

        auth().onAuthStateChanged((user) => user ? this.onUserSignIn(user) : this.onUserSignOut());
    }

    signUp(email: string, password: string) {
        return auth().createUserWithEmailAndPassword(email, password).then((res: any) => {
            //save detail into db also
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
        });
    }

    signIn(email: string, password: string) {
        auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            console.log(error);
            return error;
        });
        return signInPromise;
    }

    onUserSignIn(user) {
        // get details
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
    }

    onUserSignOut() {

    }


}