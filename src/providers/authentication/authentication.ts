import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { User } from '../../models/user/user.models';
import { Roles } from './../../models/roles/roles.models';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthenticationProvider {

  user: firebase.User;

  constructor(private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        // console.log(JSON.stringify(user));
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

  public login(user: User): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  public logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  public signup(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public updateUserData(user: User) {
    if (user) {
      const userRef = this.db.object<User>(`users/${user.uid}`);
      return userRef.update(user);
    }
  }

}
