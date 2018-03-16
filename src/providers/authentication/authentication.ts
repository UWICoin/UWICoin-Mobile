import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { User } from '../../models/user/user.models';
import { Roles } from './../../models/roles/roles.models';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class AuthenticationProvider {

  uid: string;

  constructor(private afAuth: AngularFireAuth,
    private db: DatabaseProvider) {
      
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
      else {
        this.uid = null;
      }
    });
  }

  public forgotPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public getUser$(): Observable<User> {
    return this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.db.getObject(`users/${user.uid}`);
      }
      else {
        return Observable.of(null);
      }
    });
  }

  // Returns whether or not the user is authenticated
  public isAuthenticated() {
    const user = this.afAuth.auth.currentUser;
    if (user) {
      return user ? user.emailVerified : false;
  }
    return false;
  }

  // Returns an observable of whether or not the user is authenticated
  public isAuthenticated$() {
    return this.afAuth.authState.switchMap(user => {
      if (user) {
        return Observable.of(user.emailVerified);
      }
      else {
        return Observable.of(false);
      }
    });
  }

  public isAccountSetup$(): Observable<boolean> {
    const user = this.afAuth.auth.currentUser;
    if(user) {
      return this.db.getObject(`users/${user.uid}/account_setup`);
    }
    return Observable.of(null);
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
