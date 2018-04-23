import { ToastProvider } from './../../providers/toast/toast';
import { IQRCodeOptions } from './../../models/qrcode-options/qrcode-options.models';
import { RippleLibProvider } from './../../providers/ripple-lib/ripple-lib';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@IonicPage()
@Component({
	selector: 'scan',
	templateUrl: 'scan.html',
})
export class ScanPage {

	loading = new Subject<boolean>();
	qrcode: IQRCodeOptions
	subscriptions: Subscription;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private authProvider: AuthenticationProvider,
		private rippleLib: RippleLibProvider,
		private toastProvider: ToastProvider) {

		this.setupQRCode();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ScanPage');
	}

	ionViewWillLeave() {
		if (this.subscriptions) {
			this.subscriptions.unsubscribe();
		}
	}

	private setupQRCode() {

		this.subscriptions = this.authProvider.getAccount$().take(1).subscribe(account => {
			this.qrcode = {
				value: account.address,
				scale: 10,
				imageWidth: 400
			}
		}, error => {
			this.toastProvider.showToast('Error fetching address');
			console.log('Error fetching address(scan): ', error);
		});
	}

}
