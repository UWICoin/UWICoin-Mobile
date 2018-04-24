import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-outlet-detail',
  templateUrl: 'outlet-detail.html',
})
export class OutletDetailPage {

  outlet: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.outlet = this.navParams.get('outlet');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OutletDetailPage');
  }

}
