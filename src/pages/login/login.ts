import { ToastProvider } from './../../providers/toast/toast';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailDomainValidator } from '../../validators/authentication/email/email-validator';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  email: string = 'darion.hernandez@my.uwi.edu';
  password: string = 'password1';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthenticationProvider,
    public toastProvider: ToastProvider,
    public formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      'email': [null, Validators.compose([Validators.required, Validators.email, emailDomainValidator])],
      'password': [null, Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewCanEnter() {
    // return !this.authProvider.isAuthenticated();
  }

  // Sends the user to a password reset page to enter email to verify password
  forgotPassword(): void {
    this.navCtrl.push('PasswordResetPage');
  }

  // Sends the user to the signup page
  goToSignUp(): void {
    this.navCtrl.setRoot('SignupPage');
  }

  // Logs the user in with their uwi email and password, then directs them to their dashboard
  login(): void {
    this.authProvider.login(this.email, this.password).then((user) => {
      this.authProvider.isAccountSetup$().take(1).subscribe(setup => {
        if (user.emailVerified && setup == true) {
        this.navCtrl.setRoot('DashboardPage');
      }
        else if (user.emailVerified && setup == false) {
          this.navCtrl.setRoot('SetupAccountPage');
        }
      else {
          this.authProvider.logout().then(() => {
        this.showError('Verify your email to continue');
          });
      }
      });
    }, error => {
      this.showError(error);
    });
  }

  showError(error) {
    // Error codes at https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword
    switch (error.code) {
      case 'auth/user-not-found':
        this.toastProvider.showToast('Email not found');
        this.loginForm.reset(); // Clear the contents in the form
        break;
      case 'auth/wrong-password':
        this.toastProvider.showToast('Wrong password');
        this.loginForm.controls['password'].reset(); // Clears only the password field
        break;
      case 'auth/network-request-failed':
        this.toastProvider.showToast('Cannot connect to network');
        this.loginForm.reset(); // Clear the contents in the form
        break;
      default:
        this.toastProvider.showToast('Verify your email to continue');
        this.loginForm.reset(); // Clear the contents in the form
    }
    console.error(error);
  }
}
