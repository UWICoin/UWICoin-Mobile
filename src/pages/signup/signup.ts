import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { emailDomainValidator, emailMatchValidator } from '../../validators/authentication/email/email-validator';
import { passwordMatchValidator } from '../../validators/authentication/password/password-validator';

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

  goToLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

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
            // Show toast to verify email to continue
          });
        })
      }
    }, error => {
      this.showError(error);
    });
  }

  showError(error) {
    console.error(error);
  }

}
