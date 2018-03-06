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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthenticationProvider,
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
    return !this.authProvider.isAuthenticated();
  }

  forgotPassword(): void {
    // Direct the user to a password reset page to enter email to verify password
    this.navCtrl.push('PasswordResetPage');
  }

  goToSignUp(): void {
    this.navCtrl.setRoot('SignupPage');
  }

  login(user: any): void {
    console.log('Login clicked');
    this.authProvider.login(user).then((user) => {
      if(user.emailVerified) {
        this.navCtrl.setRoot('DashboardPage');
      }
      else {
        this.showError('Verify your email to continue');
      }
    }, error => {
      this.showError(error);
    });
  }

  showError(error) {
    console.error(error);
  }
}
