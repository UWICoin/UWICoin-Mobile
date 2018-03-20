import { IQRCodeOptions } from './../../models/qrcode-options/qrcode-options.models';
import { RippleLibProvider } from './../../providers/ripple-lib/ripple-lib';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  qrcode: IQRCodeOptions

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private rippleLib: RippleLibProvider) {
    
      this.setupQRCode();
  }

  ionViewDidLoad() {

  }

  ionViewCanEnter() {
    return this.authProvider.isAuthenticated();
  }

  private setupQRCode() {
    const address = this.rippleLib.getAddress();
    console.log(address);
    this.qrcode = {
      value: address,
      scale: 10,
      imageWidth: 400,
      refresh: 10
    }
  }

}
