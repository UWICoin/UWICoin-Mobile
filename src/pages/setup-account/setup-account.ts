import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { DatabaseProvider } from './../../providers/database/database';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { RippleLibProvider } from '../../providers/ripple-lib/ripple-lib';

@IonicPage()
@Component({
  selector: 'page-setup-account',
  templateUrl: 'setup-account.html',
})
export class SetupAccountPage {

  loading = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private rippleLib: RippleLibProvider,
    private dbProvider: DatabaseProvider) {

    this.updateAddress();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupAccountPage');
  }

  updateAddress() {
    this.authProvider.getUser$().take(1).subscribe(user => {
      const account = this.rippleLib.generateAddress();
      if (user) {
        const data = {
          'account_setup': true,
          'account': account,
        }
        this.dbProvider.updateObject(`users/students/${user.uid}`, data).then(() => {
          this.loading = false;
        }, error => {
          console.log('Updating student error: ', error);
        });
      }
    }, error => {
      console.log('Setup account: ', error);
    });
  }

  continue() {
    this.navCtrl.setRoot('DashboardPage');
  }

}
