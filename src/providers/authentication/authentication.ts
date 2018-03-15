import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { User } from '../../models/user/user.models';
import { Roles } from './../../models/roles/roles.models';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class AuthenticationProvider {

  user: firebase.User;

  constructor(private afAuth: AngularFireAuth,
    private db: DatabaseProvider) {
      

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
      }
      else {
        this.user = null;
      }
    });
  }

  public forgotPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  // Returns whether or not the user is authenticated
  public isAuthenticated() {
    return this.user ? this.user.emailVerified : false;
  }

  // Returns an observable of whether or not the user is authenticated
  public isAuthenticated$() {
    return this.afAuth.authState.map(auth => {
      if (auth) {
        return auth.emailVerified;
      }
      return false;
    });
  }

  public login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  public signup(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public updateUserData(user: User) {
    if (user) {
      return this.db.updateObject(`users/${user.uid}`, user);
    }
  }

}
