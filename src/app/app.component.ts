import { IBalance } from './../models/balance/balance.models';
import { User } from './../models/user/user.models';
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { Page } from '../models/page/page.models';
import { RippleLibProvider } from '../providers/ripple-lib/ripple-lib';
import { ToastProvider } from '../providers/toast/toast';
import { Observable } from 'rxjs/Observable';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  balance: Promise<IBalance>;
  rootPage: string = 'LoginPage';
  pages: Page[];
  user$: Observable<User>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authProvider: AuthenticationProvider,
    public menuCtrl: MenuController,
    public rippleLib: RippleLibProvider,
    public toastProvider: ToastProvider) {

    this.authProvider.isAuthenticated$().subscribe(async isAuthenticated => {
      if (isAuthenticated) {
        await this.rippleLib.connect();
        this.user$ = this.authProvider.getUser$();
        this.balance = this.rippleLib.getBalance();
      }
      else {
        this.rippleLib.disconnect();
        this.user$ = null;
        this.balance = null;
      }
    });

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

  ionViewWillUnload() {
    this.rippleLib.disconnect();
  }

  logout() {
    this.authProvider.logout().then(() => {
      this.menuCtrl.close();
      this.nav.setRoot('LoginPage').then(() => {
        this.toastProvider.showToast('Logged out successfully');
      });
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

