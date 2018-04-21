import { ToastProvider } from './../../providers/toast/toast';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  @ViewChild('slider') slider: Slides;
  passwordForm: FormGroup;
  password: string;

  constructor(public navParams: NavParams,
    private view: ViewController,
    private authProvider: AuthenticationProvider,
    private dbProvider: DatabaseProvider,
    private toastProvider: ToastProvider,
    private formBuilder: FormBuilder) {

      this.passwordForm = this.formBuilder.group({
        'password': [null, Validators.compose([Validators.required])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  closeModal() {
    this.view.dismiss();
  }

  accept() {
    this.slider.slideTo(2);
  }

  cancel() {
    this.view.dismiss().then(() => {
      this.toastProvider.showToast('Transaction canceled', 'errorToast');
    });
  }

  submitTransaction() {
    if(this.passwordForm.valid) {
      this.authProvider.reauthenticate(this.password).then(result => {
        console.log(result);
      }).catch(error => { 
        console.log('Payment: ', error);
      });
    }
    else {
      this.toastProvider.showToast('Invalid password');
    }
  }

}
