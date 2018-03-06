import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class AuthenticationProvider {

  user: firebase.User;

  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        console.log('Is email verified: ' + user.emailVerified);
      }
      else {
        this.user = null;
      }
    });
  }

  public forgotPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public isAuthenticated(): boolean {
    return this.user != null && this.user.emailVerified;
  }

  public login(user: any): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  public logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  public signup(user: any): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(result => {
      this.afAuth.auth.currentUser.sendEmailVerification();
    });
  }

  public updateUserData() {
    
  }

}
