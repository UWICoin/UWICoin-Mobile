import { Page } from './../../models/page/page.models';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  pages: Page[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthenticationProvider) {

    this.pages = [
      { title: 'Account', component: 'AccountPage', icon: 'key' },
      { title: 'Notifications', 'component': 'NotificationsPage', icon: 'notifications' },
      { title: 'Help', 'component': 'HelpPage', icon: 'help-circle'}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  ionViewCanEnter(){
    return this.authProvider.isAuthenticated();
  }

  openPage(page: Page) {
    this.navCtrl.push(page.component);
  }

}
