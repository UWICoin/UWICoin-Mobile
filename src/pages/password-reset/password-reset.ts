import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailDomainValidator } from '../../validators/authentication/email/email-validator';
import { ToastProvider } from './../../providers/toast/toast';

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
    public authProvider: AuthenticationProvider,
    public toastProvider: ToastProvider) {

    this.resetForm = this.formBuilder.group({
      'email': [null, Validators.compose([Validators.required, Validators.email, emailDomainValidator])]
    });
  }

  ionViewCanEnter() {
    return !this.authProvider.isAuthenticated();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordResetPage');
  }

  // Sends a link to reset the user's password with the given email
  resetPassword(user: any) {
    this.authProvider.forgotPassword(user.email).then(result => {
      this.navCtrl.pop().then(() => {
        this.toastProvider.showToast('Please check your email');
      });
    }, error => {
      this.showError(error);
    });
  }

  // Shows a toast with an error based on firebase error codes
  showError(error) {
    // Error codes at https://firebase.google.com/docs/reference/js/firebase.auth.Auth#sendPasswordResetEmail
    switch (error.code) {
      case 'auth/invalid-email':
        this.toastProvider.showToast('Invalid email');
        break;
      case 'auth/user-not-found':
        this.toastProvider.showToast('Email not found');
        break;
      default:
        this.toastProvider.showToast('Error in sending email. Please try again');
        break;
    }
    console.error(error.code);
  }

}
