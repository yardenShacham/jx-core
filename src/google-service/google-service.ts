export class googleService {

    constructor(private token: string) {

    }

    signIn(withPopup: boolean) {
        let provider = new this.auth.GoogleAuthProvider();
        if (withPopup) {
            this.auth().signInWithPopup(provider).then((result: any) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                this.tokeresult.credential.accessToken;
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
            this.auth().getRedirectResult().then((result: any) => {
                if (result.credential) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    let token = result.credential.accessToken;
                    // ...
                }
                // The signed-in user info.
                let user = result.user;
            }).catch(function (error: any) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // The email of the user's account used.
                let email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                let credential = error.credential;
                // ...
            });
        }
    }
}