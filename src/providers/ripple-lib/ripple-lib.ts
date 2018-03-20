import { AuthenticationProvider } from './../authentication/authentication';
import { DatabaseProvider } from './../database/database';
import { IAccount } from './../../models/account/account.models';
import { IBalance } from '../../models/balance/balance.models';
import { Injectable } from '@angular/core';
import { IPayment } from '../../models/payment/payment.models';
import { ITransaction } from './../../models/transaction/transaction.models';
import { Observable } from 'rxjs/Observable';
import { Page } from './../../models/page/page.models';
import { Subscription } from 'rxjs/Subscription';
import * as RippleLib from 'ripple-lib';
import 'rxjs/add/operator/take';

@Injectable()
export class RippleLibProvider {

  private api: any = new RippleLib.RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233' });
  private account: any;

  constructor(private authProvider: AuthenticationProvider,
    private dbProvider: DatabaseProvider) { }

  async connect(): Promise<any> {
    if (!this.isConnected()) {
      return this.api.connect().then(() => {
        console.log('Ripple connected');
        this.fetchAddress();
      });
    }
  }

  async disconnect(): Promise<any> {
    if (this.isConnected()) {
      return this.api.disconnect().then(() => {
        console.log('Ripple disconnected');
      });
    }
  }

  fetchAddress(): void {
    const uid = this.authProvider.uid;
    if (uid) {
      this.dbProvider.getObject(`users/${uid}/account`).take(1).subscribe(addresses => {
        if (addresses) {
          this.account = addresses;
        }
      });
    }
  }

  generateAddress(): IAccount {
    // return this.api.generateAddress();
    // TODO: Remove when deploying to production
    const account: IAccount = {
      address: 'ra88fDucMxbEtmptg3PFodGxF818FjnYST',
      secret: 'sngu1xZoC7C4RzsQEQARBduYohUnX'
    }
    return account;
  }

  getAccount(): IAccount {
    return this.account;
  }

  getAddress(): string {
    return this.account.address;
  }

  // Returns the balance for a sngle currency
  async getBalance(currency?: string): Promise<IBalance> {
    if (this.account) {
      let options = {
        currency: currency || 'XRP'
      };
      return this.api.getBalances(this.account.address, options).then(balances => { return balances[0] });
    }
    return Promise.resolve(null);
  }

  // Returns the balances for each of the available currencies
  async getBalances(): Promise<IBalance[]> {
    if (this.account) {
      return this.api.getBalances(this.account.address);
    }
    return Promise.resolve(null);
  }

  // Gets all the transactions for the user's account
  async getTransactions(): Promise<ITransaction[]> {
    if (this.account) {
      let options = {
        minLedgerVersion: 7000000,
        maxLedgerVersion: 7565093
      }
      return this.api.getTransactions(this.account.address, options);
    }
    return Promise.resolve(null);
  }

  isConnected(): boolean {
    return this.api.isConnected();
  }

  async preparePayment(vendorAddress: string, amount: string): Promise<any> {
    if (this.account.address) {

      const instructions = {
        maxLedgerVersionOffset: 5
      };

      const payment: IPayment = {
        source: {
          address: this.account.address,
          maxAmount: {
            value: amount,
            currency: 'XRP'
          }
        },
        destination: {
          address: vendorAddress,
          amount: {
            value: amount,
            currency: 'XRP'
          }
        }
      };

      return this.api.preparePayment(this.account.address, payment, instructions).then(prepared => {
        console.log('Payment transaction prepared');
        const { signedTransaction } = this.api.sign(prepared.txJSON, this.account.secret);
        console.log('Payment transaction signed');
        return this.api.submit(signedTransaction).then(message => {
          console.log(message);
        });
      });
    }
    return Promise.resolve(null);
  }

}
