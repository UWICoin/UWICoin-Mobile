import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { User } from '../../models/user/user.models';
import { Roles } from './../../models/roles/roles.models';
import { DatabaseProvider } from '../database/database';
import { RippleLibProvider } from '../ripple-lib/ripple-lib';

@Injectable()
export class AuthenticationProvider {

  private uid: string;
  private user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
    private db: DatabaseProvider,
    private rippleLib: RippleLibProvider) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.user = this.db.getObject(`users/${user.uid}`);
      }
      else {
        this.uid = null;
        this.user = Observable.of(null);
      }
    });
  }

  public async forgotPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public getUID(): string {
    return this.uid;
  }

  public getUser$(): Observable<User> {
    return this.user;
  }

  // Returns whether or not the user is authenticated
  public isAuthenticated(): boolean {
    const user = this.afAuth.auth.currentUser;
    if (user) {
      return user ? user.emailVerified : false;
    }
    return false;
  }

  // Returns an observable of whether or not the user is authenticated
  public isAuthenticated$(): Observable<boolean> {
    return this.afAuth.authState.map(user => user.emailVerified);
  }

  public isAccountSetup$(): Observable<boolean> {
    return this.user.map(user => user.account_setup);
  }

  public async login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public async logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  public async signup(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public async updateUserData(user: User): Promise<void> {
    if (user) {
      return this.db.updateObject(`users/${user.uid}`, user);
    }
  }

}
