import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {

  resetForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthenticationProvider) {

    this.resetForm = this.formBuilder.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])]
    });
  }

  ionViewCanEnter(){
    return !this.authProvider.isAuthenticated();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordResetPage');
  }

  resetPassword(user: any) {
    this.authProvider.forgotPassword(user.email).then(result => {
      this.navCtrl.pop().then(() => {
        // Show toast to please check you email
      });
    }, error => {
      this.showError(error);
    });
  }

  showError(error) {
    console.error(error);
  }

}
