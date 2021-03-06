import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-outlets',
  templateUrl: 'outlets.html',
})
export class OutletsPage {

  // outlets = [
  //   {
  //     vendorName: 'KFC ',
  //     description: 'KFC is a fast foot outlet with excelent traditional chicken',
  //     vendorType: 'Restaurant',
  //     addressLine1: 'South food court',
  //     city: 'St Augustine',
  //     adminEmail: 'darionhernandez868@gmail.com',
  //     telephone1: '1-868-678-8584',
  //     telephone2: '1-868-678-8585',
  //     facebookLink: 'facebook.com',
  //     twitterLink: 'twitter.com',
  //     instagramLink: 'instagram.com'
  //   }
  // ];
  outlets: Observable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthenticationProvider,
    public db: DatabaseProvider) {

    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OutletsPage');
  }

  getDetails(outlet) {
    this.navCtrl.push('OutletDetailPage', { outlet: outlet });
  }

  getData(refresher?) {

    this.outlets = this.db.getList('vendors/').take(1);
      if(refresher) {
      refresher.complete();
    }
  }

}
