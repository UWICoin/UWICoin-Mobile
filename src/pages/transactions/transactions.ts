import { DatabaseProvider } from './../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { RippleLibProvider } from '../../providers/ripple-lib/ripple-lib';
import { ITransaction } from '../../models/transaction/transaction.models';
import { IAccount } from '../../models/account/account.models';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/observable/forkJoin';

@IonicPage()
@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {

  transactions: any;
  account: IAccount;
  subscriptions: Subscription;
  transactionsLimit = 20;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthenticationProvider,
    public rippleLib: RippleLibProvider,
    public db: DatabaseProvider) {

    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsPage');
  }

  ionViewWillLeave(){
    if(this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  getData(refresher?) {
    this.subscriptions = this.authProvider.getAccount$().take(1).subscribe(account => {
      if (account) {
        this.account = account;
        this.transactions = this.rippleLib.getTransactions(account.address, this.transactionsLimit);
      }
      if(refresher) {
        refresher.complete();
      }
    });
  }

}