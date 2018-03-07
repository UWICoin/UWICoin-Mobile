import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { emailDomainValidator, emailMatchValidator } from '../../validators/authentication/email/email-validator';
import { passwordMatchValidator } from '../../validators/authentication/password/password-validator';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthenticationProvider,
    public toastProvider: ToastProvider,
    public formBuilder: FormBuilder) {

    this.signupForm = this.formBuilder.group({
      'fullName': [null, Validators.compose([Validators.required, Validators.pattern('([A-Za-z]+[" "][A-Za-z]+)')])],
      'email': [null, Validators.compose([Validators.required, Validators.email, emailDomainValidator, emailMatchValidator])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(7)])],
      'confirmPassword': [null, Validators.compose([Validators.required, passwordMatchValidator])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  ionViewCanEnter() {
    return !this.authProvider.isAuthenticated();
  }

  // Sends the user to the login page
  goToLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

  // Registers a user using their given details
  signup(user: any) {
    this.authProvider.signup(user).then(result => {

      if (this.authProvider.isAuthenticated()) {
        console.log('The user is authenticated');
        this.navCtrl.setRoot('DashboardPage');
      }
      else {
        console.log('The user is not authenticated');
        this.authProvider.logout().then(() => {
          this.navCtrl.setRoot('LoginPage').then(() => {
            this.toastProvider.showToast('Verify your email to continue');
          });
        })
      }
    }, error => {
      this.showError(error);
    });
  }

  // Shows a toast with an error based on firebase error codes
  showError(error) {
    // Error codes at https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.toastProvider.showToast('Email already in use');
        break;
      case 'auth/invalid-email':
        this.toastProvider.showToast('Invalid email');
        break;
      case 'auth/operation-not-allowed':
        this.toastProvider.showToast('Operation not allowed');
        break;
      case 'auth/weak-password':
        this.toastProvider.showToast('Weak password');
        break;
      default:
        this.toastProvider.showToast('Error creating user');
        break;
    }
    console.error(error);
  }

}
