import { Observable } from 'rxjs/Observable';
import { AuthenticationProvider } from './../authentication/authentication';
import { DatabaseProvider } from './../database/database';
import { Injectable } from '@angular/core';
import * as RippleLib from 'ripple-lib';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

@Injectable()
export class RippleLibProvider {

  api: any = new RippleLib.RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233' });
  address_info: any;
  subscriptions: Subscription;

  constructor(private authProvider: AuthenticationProvider,
    private dbProvider: DatabaseProvider) {

  }

  connect(): Promise<any> {
    if (!this.isConnected()) {
      return this.api.connect().then(() => {
        console.log('Ripple connected');
        this.fetchAddress();
      });
    }
  }

  disconnect(): Promise<any> {
    if (this.isConnected()) {
      return this.api.disconnect().then(() => {
        console.log('Ripple disconnected');
      });
    }
  }

  fetchAddress() {
    const uid = this.authProvider.uid;
    if(uid) {
      this.subscriptions = this.dbProvider.getObject(`users/${uid}/addresses`).take(1).subscribe(addresses => {
        if(addresses) {
          this.address_info = addresses;
        }
      });
    }
  }

  generateAddress() {
    return this.api.generateAddress();
  }

  getTransactions(): Promise<any> {
    if (this.address_info) {
      return this.api.getTransactions(this.address_info.address);
    }
  }

  isConnected(): boolean {
    return this.api.isConnected();
  }

  preparePayment(vendorAddress: string): Promise<any> {
    if (this.address_info.address) {
      return this.api.preparePayment(this.address_info.address, vendorAddress, null).then(prepared => {
        console.log('Payment prepared');
        return prepared;
      });
    }
  }

}
