import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { IUser } from '../../models/user/user.models';
import { Roles } from './../../models/roles/roles.models';
import { DatabaseProvider } from '../database/database';
import { RippleLibProvider } from '../ripple-lib/ripple-lib';
import { Subscription } from 'rxjs/Subscription';
import { IAccount } from '../../models/account/account.models';

@Injectable()
export class AuthenticationProvider {

  private subscriptions: Subscription;

  private userPath = 'users/students/';

  constructor(public afAuth: AngularFireAuth,
    private db: DatabaseProvider) {
  }

  public async forgotPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public getAuthState() {
    return this.afAuth.authState;
  }

  public getUser$(): Observable<IUser> {
    return this.afAuth.authState.switchMap(user => {
      if(user) {
        return this.db.getObject(`${this.userPath}/${user.uid}`);
      }
      return [];
    });
  }

  public getAccount$(): Observable<IAccount> {
    return this.afAuth.authState.switchMap(user => {
      if(user) {
        return this.db.getObject(`${this.userPath}/${user.uid}/account`);
      }
      return [];
    });
  }

  public isAccountSetup$(uid): Observable<boolean> {
    return this.db.getObject(`${this.userPath}/${uid}/account_setup`);
  }

  public async login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public async logout(): Promise<any> {
    return this.afAuth.auth.signOut().then(() => console.log('Logged out'));
  }

  public async signup(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public async updateUserData(user: IUser): Promise<void> {
    if (user) {
      return this.db.updateObject(`users/students/${user.uid}`, user);
    }
  }

  public async reauthenticate(password: string) {
    const user = firebase.auth().currentUser;
    return user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, password));
  }

}
