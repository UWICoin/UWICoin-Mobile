import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './../../firebase.config';
import { AngularFireModule } from 'angularfire2';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController, NavParams } from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignupPage } from './signup';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ToastProvider } from './../../providers/toast/toast';
import { of } from 'rxjs/observable/of';

class MockNavParams {
    data = {};

    get(param) {
        return this.data[param];
    }
}

describe('Signup page test', () => {

    let debugElement: DebugElement;
    let fixture: ComponentFixture<SignupPage>;
    let component: SignupPage;
    let provider: AuthenticationProvider;
    let spy: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignupPage],
            imports: [
                AngularFireModule.initializeApp(FIREBASE_CONFIG),
                AngularFireAuthModule,
                AngularFireDatabaseModule,
                IonicModule.forRoot(SignupPage),
                FormsModule,
                ReactiveFormsModule
            ],
            providers: [
                AuthenticationProvider,
                FormBuilder,
                NavController,
                ToastProvider,
                { provide: NavParams, useClass: MockNavParams }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupPage);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        provider = debugElement.injector.get(AuthenticationProvider);

        fixture.detectChanges();
    })

    afterEach(() => {
        debugElement = null;
        fixture = null;
        provider = null;
        spy = null;
    });

    it('it should create the signup page', () => {
        expect(component).toBeDefined();
    });

    it('should expect unauthenticated user to enter page', () => {
        spy = spyOn(provider, 'isAuthenticated').and.returnValue(false);
        expect(spy).toBeTruthy(false);
        expect(component.ionViewCanEnter()).toBeTruthy();
    });

    it('should expect authenticated user to not enter page', () => {
        spy = spyOn(provider, 'isAuthenticated').and.returnValue(true);
        expect(spy).toBeTruthy(true);
        expect(component.ionViewCanEnter()).toBeFalsy();
    });

    it('should expect the email testemail@gmail.com to be invalid', () => {
        let email = 'testemail@gmail.com';
        let emailCtrl = component.signupForm.controls['email'];
        emailCtrl.setValue(email);

        expect(emailCtrl.value).toEqual(email);
        expect(emailCtrl.valid).toBeFalsy();
        expect(emailCtrl.getError('wrongDomain')).toBeTruthy();
        expect(component.signupForm.valid).toBeFalsy();
    });

    it('should expect email to be invalid if the full name is not a subset of its value', () => {
        let fullName = 'Jane Doe';
        let email = 'john.doe@my.uwi.edu';

        let nameCtrl = component.signupForm.controls['fullName'];
        let emailCtrl = component.signupForm.controls['email'];

        nameCtrl.setValue(fullName);
        emailCtrl.setValue(email);
        expect(nameCtrl.value).toEqual(fullName);
        expect(emailCtrl.value).toEqual(email);
        expect(nameCtrl.valid).toBeTruthy();
        expect(emailCtrl.valid).toBeFalsy();
    });

    it('should expect email to be valid if the full name is a set subset of its value', () => {
        let fullName = 'John Doe';
        let email = 'john.doe@my.uwi.edu';

        let nameCtrl = component.signupForm.controls['fullName'];
        let emailCtrl = component.signupForm.controls['email'];

        nameCtrl.setValue(fullName);
        emailCtrl.setValue(email);

        expect(nameCtrl.value).toEqual(fullName);
        expect(emailCtrl.value).toEqual(email);
        expect(nameCtrl.valid).toBeTruthy();
        expect(emailCtrl.valid).toBeTruthy()
    });

    it('should expect a password mismatch to be invalid', () => {
        let password1 = 'password1';
        let password2 = 'password2';

        let passwordCtrl = component.signupForm.controls['password'];
        let confirmPasswordCtrl = component.signupForm.controls['confirmPassword'];

        passwordCtrl.setValue(password1);
        confirmPasswordCtrl.setValue(password2);

        expect(passwordCtrl.value).toEqual(password1);
        expect(confirmPasswordCtrl.value).toEqual(password2);
        expect(passwordCtrl.valid).toBeTruthy();
        expect(confirmPasswordCtrl.valid).toBeFalsy();
        expect(confirmPasswordCtrl.hasError('mismatch')).toBeTruthy();
    });

    it('should expect passwords to match and valid', () => {
        let password1 = 'password1';
        let password2 = 'password1';

        let passwordCtrl = component.signupForm.controls['password'];
        let confirmPasswordCtrl = component.signupForm.controls['confirmPassword'];

        passwordCtrl.setValue(password1);
        confirmPasswordCtrl.setValue(password2);

        expect(passwordCtrl.value).toEqual(password1);
        expect(confirmPasswordCtrl.value).toEqual(password2);
        expect(passwordCtrl.valid).toBeTruthy();
        expect(confirmPasswordCtrl.valid).toBeTruthy();
    });

});