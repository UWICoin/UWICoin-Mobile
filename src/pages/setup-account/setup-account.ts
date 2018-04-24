import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { RippleLibProvider } from '../../providers/ripple-lib/ripple-lib';
import { AngularFireDatabase } from 'angularfire2/database';

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
    private db: AngularFireDatabase) {

    this.updateAddress();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupAccountPage');
  }

  updateAddress() {
    this.authProvider.getUser$().take(1).subscribe(user => {
    
      if (user) {

        const account = this.rippleLib.generateAddress();

        const accountInfo = {
          name: user.full_name,
          address: account.address
        }

        const updates = {};
        updates[`users/students/${user.uid}/account_setup`] = true;
        updates[`users/students/${user.uid}/account`] = account;
        updates[`accounts/${user.uid}/`] = accountInfo;

        const ref = this.db.object('/');
        ref.update(updates).then(() => {
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
