const auth = require("firebase").auth;
import {Deferred} from '../promise-helper/Deferred';
import {lifeStyleMethods} from './lifeStyleMethods';

export class authService {
    signInDeferred: Deferred = new Deferred()
    tokens: any
    lifeStyleCallbacks: any

    constructor(lifeStyleCallbacks: any) {
        this.lifeStyleCallbacks = lifeStyleCallbacks ? lifeStyleCallbacks : {};
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
        this.signInDeferred = new Deferred();
        auth().signInWithEmailAndPassword(email, password).catch((error: any) => {
            this.signInDeferred.reject(error);
            this.signInDeferred = undefined;
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
            auth().getRedirectResult().then(function (result: any) {
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

    addLifeStyleCallback(lifeName: string, callback: any) {
        let isLifeNameExist = false;
        let keys = Object.keys(lifeStyleMethods);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === lifeName) {
                isLifeNameExist = true;
                break;
            }
        }
        if (isLifeNameExist)
            this.lifeStyleCallbacks[lifeName] = callback;
    }

    signOut() {
        return auth().signOut();
    }

    getCurrentUser() {
        return auth().currentUser;
    }

    isAuthenticated() {
        return localStorage.getItem("logedIn");
    }

    waitForCurrentUser() {
        let isAuthenticated = this.isAuthenticated();
        if (!isAuthenticated)
            return Promise.reject('user loged out');
        else {
            if (!this.signInDeferred)
                return Promise.resolve(auth().currentUser);

            return this.signInDeferred.promise;
        }
    }

    onUserSignOut() {
        this.signInDeferred = undefined;
        localStorage.removeItem("logedIn");
        this.lifeStyleCallbacks[lifeStyleMethods.onSignOut] &&
        typeof this.lifeStyleCallbacks[lifeStyleMethods.onSignOut] === "function" ?
            this.lifeStyleCallbacks[lifeStyleMethods.onSignOut]() : null;
    }

    onUserSignIn(user: any) {
        if (this.signInDeferred) {
            // get details
            let displayName = user.displayName;
            let email = user.email;
            let emailVerified = user.emailVerified;
            let photoURL = user.photoURL;
            let isAnonymous = user.isAnonymous;
            let uid = user.uid;
            let providerData = user.providerData;
            localStorage.setItem("logedIn", JSON.stringify(user));
            this.signInDeferred.resolve(user);
            this.signInDeferred = undefined;
            this.lifeStyleCallbacks[lifeStyleMethods.onSignIn] &&
            typeof this.lifeStyleCallbacks[lifeStyleMethods.onSignIn] === "function" ?
                this.lifeStyleCallbacks[lifeStyleMethods.onSignIn](user) : null;
        }
    }
}