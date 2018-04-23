import { RippleLibProvider } from './../../providers/ripple-lib/ripple-lib';
import { ToastProvider } from './../../providers/toast/toast';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ILedger } from '../../models/ledger/ledger';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/observable/zip";

@IonicPage()
@Component({
	selector: 'page-payment',
	templateUrl: 'payment.html',
})
export class PaymentPage {

	@ViewChild(Slides) slider: Slides;
	description: string;
	destination: any;
	amount: number;
	currency: string;
	fee: number;
	key: string;
	subtotal: number;
	source: any;
	passwordForm: FormGroup;
	password: string;
	vendorName: string;
	loading = false;

	constructor(public navParams: NavParams,
		private view: ViewController,
		private authProvider: AuthenticationProvider,
		private dbProvider: DatabaseProvider,
		private toastProvider: ToastProvider,
		private formBuilder: FormBuilder,
		private rippleLib: RippleLibProvider) {

		this.passwordForm = this.formBuilder.group({
			'password': [null, Validators.compose([Validators.required])]
		});

		this.description = navParams.get('description');
		this.destination = navParams.get('destination');
		this.key = navParams.get('key');

		this.source = navParams.get('source');

		const obs1 = this.rippleLib.getLedger().take(1);
		const obs2 = this.dbProvider.getObject(`accounts/${this.destination.address}`).take(1);

		Observable.zip(obs1, obs2).subscribe(([ledger, account]) => {

			this.currency = this.source.maxAmount.currency;
			this.amount = parseFloat(this.source.maxAmount.value);
			this.fee = parseFloat(this.rippleLib.getFee());
			this.subtotal = this.amount + this.fee;
			this.vendorName = account.name;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PaymentPage');
	}

	accept() {
		this.slider.lockSwipes(false);
		this.slider.slideNext();
		this.slider.lockSwipes(true);
	}

	cancel() {
		this.dbProvider.updateObject(`transactions/debit/${this.key}/`, { status: 'canceled' }).then(() => {
			this.view.dismiss().then(() => {
				this.toastProvider.showToast('Transaction canceled', 'errorToast');
			}).catch(error => {
				console.log(error);
			});
		}).catch(error => {
			console.log('Error updating canceled transaction: ', error);
			this.toastProvider.showToast('Error updating canceled transaction');
		});
	}

	submitTransaction() {
		if (this.passwordForm.valid) {
			console.log(this.password);
			this.authProvider.reauthenticate(this.password).then(result => {

				this.loading = true;

				const options = {
					source: this.source,
					destination: this.destination
				};

				this.authProvider.getAccount$().take(1).subscribe(account => {
					this.rippleLib.preparePayment(account, account.address, options).then(prepared => {
						console.log(prepared);
						this.dbProvider.setObject(`transactions/debit/${this.key}/status`, 'success').then(() => {
							this.view.dismiss().then(() => {
								console.log('Transaction successful');
								this.toastProvider.showToast('Transaction successful', 'successToast');
							});
						}).catch(error => {
							console.log('Error');
							this.toastProvider.showToast('Error updating successful transaction.');
						});
					}).catch(error => {
						console.error('Unable to prepare payment', error);
						this.toastProvider.showToast('Unable to prepare payment');
					});
				}, error => {
					console.log('Error getting account: ', error);
					this.toastProvider.showToast('Error getting account');
				});

			}).catch(error => {
				console.log('Payment: ', JSON.stringify(error));
				this.showError(error);
			});
		}
		else {
			this.toastProvider.showToast('Invalid password');
		}
	}

	showError(error) {
		// Error codes at https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword
		switch (error.code) {
			case 'auth/wrong-password':
				this.toastProvider.showToast('Wrong password');
				this.passwordForm.reset(); // Clear the contents of the form
				break;
			case 'auth/network-request-failed':
				this.toastProvider.showToast('Cannot connect to network');
				this.passwordForm.reset(); // Clear the contents of the form
				break;
			default:
				this.toastProvider.showToast('Please try again');
				this.passwordForm.reset(); // Clear the contents of the form
		}
		console.log('Reauthentication payment:', error);
	}

}
