import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-outlets',
  templateUrl: 'outlets.html',
})
export class OutletsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OutletsPage');
  }

  ionViewCanEnter() {
    return this.authProvider.isAuthenticated();
  }

}
