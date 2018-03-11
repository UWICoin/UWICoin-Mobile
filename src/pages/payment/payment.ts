import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  qrcode = {
    value: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
    scale: 10,
    imgwidth: 400,
    refresh: 10
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

}
