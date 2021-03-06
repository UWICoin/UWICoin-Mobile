import { IBalance } from './../../models/balance/balance.models';
import { ILedger } from './../../models/ledger/ledger';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { RippleLibProvider } from '../../providers/ripple-lib/ripple-lib';
import { Observable } from 'rxjs/Observable';
import { IAccount } from '../../models/account/account.models';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
	selector: 'page-dashboard',
	templateUrl: 'dashboard.html',
})
export class DashboardPage {

	balance: Promise<IBalance>;
	fee: string;
	transactions: any;
	ledgerInfo: Observable<ILedger>;
	subscriptions: Subscription;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public authProvider: AuthenticationProvider,
		private rippleLib: RippleLibProvider) {

		this.getData();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DashboardPage');
	}

	ionViewDidLeave() {
		if (this.subscriptions) {
			this.subscriptions.unsubscribe();
		}
	}

	getData(refresher?) {
		this.authProvider.getAccount$().take(1).subscribe((account: IAccount) => {
			if (account) {
				this.balance = this.rippleLib.getBalance(account.address);
				this.transactions = this.rippleLib.getTransactions(account.address, 5);
				this.fee = this.rippleLib.getFee();
			}
			if (refresher) {
				refresher.complete();
			}
		});
	}

	scan(): void {
		this.navCtrl.setRoot('ScanPage');
	}

}
