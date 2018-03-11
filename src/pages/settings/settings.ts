import { Page } from './../../models/page/page.models';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  pages: Page[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.pages = [
      { title: 'Account', component: 'AccountPage', icon: 'key' },
      { title: 'Notifications', 'component': 'NotificationsPage', icon: 'notifications' },
      { title: 'Help', 'component': 'HelpPage', icon: 'help-circle'}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  openPage(page: Page) {
    this.navCtrl.push(page.component);
  }

}
