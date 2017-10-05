import {appConfiguration} from '../app.config';
const firebase = require('firebase/app');
const auth = require("firebase/auth");

export class authService {
    signInDeferred: any
    signOutDeferred: any
    tokens: any

    constructor() {
        (<any>firebase).initializeApp(appConfiguration.firebase);

        auth().onAuthStateChanged((user: any) => user ? this.onUserSignIn(user) : this.onUserSignOut());
    }

    signUp(email: string, password: string) {
        return auth().createUserWithEmailAndPassword(email, password).then((res: any) => {
            //save detail into db also
        }).catch(function (error: any) {
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
        return this.signInDeferred.promise;
    }

    signInWithGoogle() {
        return this.signInWithProviders("google");
    }

    signInWithProviders(providerName: string, withPopup: boolean = true) {

        let provider = providerName === "google" ? new auth.GoogleAuthProvider() :
            new auth.FacebookAuthProvider();
        if (withPopup) {
            auth().signInWithPopup(provider).then((result: any) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                this.tokens[providerName] = result.credential.accessToken;
                // The signed-in user info.
                let user = result.user;
            }).catch((error: any) => {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // The email of the user's account used.
                let email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                let credential = error.credential;
            });
        }
        else {
            firebase.auth().getRedirectResult().then(function (result: any) {
                if (result.credential) {
                    this.tokens[providerName] = result.credential.accessToken;
                }
                // The signed-in user info.
                var user = result.user;
            }).catch((error: any) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
            });
        }
    }

    signOut() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error: any) {
            // An error happened.
        });
    }

    onUserSignIn(user: any) {
        // get details
        let displayName = user.displayName;
        let email = user.email;
        let emailVerified = user.emailVerified;
        let photoURL = user.photoURL;
        let isAnonymous = user.isAnonymous;
        let uid = user.uid;
        let providerData = user.providerData;
        this.signInDeferred(user);
    }

    onUserSignOut() {
        this.signOutDeferred();
    }


}