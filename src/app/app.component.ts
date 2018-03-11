import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { Page } from '../models/page/page.models';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'LoginPage';

  pages: Page[];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authProvider: AuthenticationProvider,
    public menuCtrl: MenuController) {

    this.pages = [
      { title: 'Dashboard', component: 'DashboardPage', icon: 'home' },
      { title: 'Pay', component: 'PaymentPage', icon: 'cash' },
      { title: 'Transactions', component: 'TransactionsPage', icon: 'swap' },
      { title: 'Outlets', component: 'OutletsPage', icon: 'cart' },
      { title: 'Settings', component: 'SettingsPage', icon: 'settings' },
    ];

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authProvider.logout().then(() => {
      this.menuCtrl.close();
      this.nav.setRoot('LoginPage').then(() => {
        // Show toast to verify email
      });
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

