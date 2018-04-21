import { DatabaseProvider } from './../providers/database/database';
import { FCM } from '@ionic-native/fcm';
import { IBalance } from './../models/balance/balance.models';
import { IUser } from './../models/user/user.models';
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform, MenuController, ModalController, AlertController } from 'ionic-angular';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { Page } from '../models/page/page.models';
import { RippleLibProvider } from '../providers/ripple-lib/ripple-lib';
import { ToastProvider } from '../providers/toast/toast';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CacheService } from "ionic-cache";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: string = 'LoginPage';
	pages: Page[];
	uid: string;
	subscriptions: Subscription;
	previousPage: string;

	constructor(public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		public authProvider: AuthenticationProvider,
		public ripple: RippleLibProvider,
		public menuCtrl: MenuController,
		public toastProvider: ToastProvider,
		public dbProvider: DatabaseProvider,
		public fcm: FCM,
		public modalCtrl: ModalController,
		public cache: CacheService,
		public alertCtrl: AlertController) {

		this.setupPages();
		this.subscriptions = this.authProvider.getAuthState().subscribe(async user => {
			if (user) {

				console.log('App component: ', user.uid);
				this.uid = user.uid;

				if (this.nav.getActive() != null && this.nav.getActive().name === 'LoginPage') {
					this.rootPage = 'DashboardPage'
				}
			}
			else {
				this.uid = null;
			}
		}, error => {
			console.log('Error getting user');
		});

		this.platform.ready().then(() => {

			this.statusBar.styleDefault();
			this.splashScreen.hide();
			console.log('Platform ready');

			this.setupCloudMessaging();
			this.setupCacheSettings();
		});

		this.platform.registerBackButtonAction(() => {

		});

	}

	ionViewDidLoad() {

	}

	ionViewWillLeave() {
		if (this.subscriptions) {
			this.subscriptions.unsubscribe();
		}
	}

	ionViewWillUnload() {
		if(this.authProvider.afAuth.auth.currentUser != null) {
			this.authProvider.logout();
		}
	}

	ionViewCanLeave() {
		return new Promise((resolve, reject) => {
			let confirm = this.alertCtrl.create({
				title: 'Confirm Exit',
				message: 'Are you sure that you want to exit the application. You will be logged out.',
				buttons: [{
					text: 'Yes',
					handler: () => {
						resolve();
					},
				}, {
					text: 'Cancel',
					handler: () => {
						reject();
					}
				}],
			});
			confirm.present();
		});
	}

	logout() {
		this.authProvider.logout().then(() => {
			this.menuCtrl.close();
			this.nav.setRoot('LoginPage').then(() => {
				this.toastProvider.showToast('Logged out successfully');
			});
		});
	}

	openPage(page) {
		if (this.nav.getActive().name !== page.component) {
			this.nav.setRoot(page.component);
		}
	}

	openPaymentModal() {
		let paymentModal = this.modalCtrl.create('PaymentPage');
		paymentModal.present();
	}

	setupCloudMessaging() {
		console.log('Setting up cloud messaging');
		this.fcm.getToken().then(token => {
			this.updateToken(token);
		}).catch(error => {
			console.log('Error getting messaging token: ', error);
		});

		this.fcm.onNotification().subscribe(data => {
			if (data.wasTapped) {
				console.log("Received in background");
				console.log(JSON.stringify(data));
			} else {
				console.log("Received in foreground");
				console.log(JSON.stringify(data.message));
				this.openPaymentModal();
			};
		}, error => {
			console.log('Error getting notification: ', error);
		});

		this.fcm.onTokenRefresh().subscribe(token => {
			this.updateToken(token);
		}, error => {
			console.log('Error refreshing message token: ', error);
		});
	}

	presentConfirm() {
		let alert = this.alertCtrl.create({
			title: 'Confirm exit',
			message: 'Are you sure you want to exit the application? You will be logged out.',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {

					}
				},
				{
					text: 'Buy',
					handler: () => {
						console.log('Buy clicked');
					}
				}
			]
		});
		alert.present();
	}

	setupCacheSettings() {
		// Set TTL to 12h
		this.cache.setDefaultTTL(60 * 60 * 12);

		// Keep our cached results when device is offline!
		this.cache.setOfflineInvalidate(false);
	}

	updateToken(token) {
		this.authProvider.getAccount$().subscribe(account => {
			if (account) {
				this.dbProvider.setObject(`fcmTokens/`, { [account.address]: token });
			}
		}, error => {
			console.log('Error updating messaging token: ', error);
		});
	}

	setupPages() {
		this.pages = [
			{ title: 'Dashboard', component: 'DashboardPage', icon: 'home' },
			{ title: 'Scan', component: 'ScanPage', icon: 'qr-scanner' },
			{ title: 'Transactions', component: 'TransactionsPage', icon: 'swap' },
			{ title: 'Outlets', component: 'OutletsPage', icon: 'cart' },
			{ title: 'Settings', component: 'SettingsPage', icon: 'settings' },
		];
	}
}

