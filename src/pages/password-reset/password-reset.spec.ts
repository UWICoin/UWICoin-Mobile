import { AngularFirestoreModule } from 'angularfire2/firestore';
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
import { PasswordResetPage } from './password-reset';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ToastProvider } from '../../providers/toast/toast';

class MockNavParams {
    data = {};

    get(param) {
        return this.data[param];
    }
}

describe('Password reset page test', () => {

    let debugElement: DebugElement;
    let fixture: ComponentFixture<PasswordResetPage>;
    let component: PasswordResetPage;
    let provider: AuthenticationProvider;
    let spy: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordResetPage],
            imports: [
                AngularFireModule.initializeApp(FIREBASE_CONFIG),
                AngularFireAuthModule,
                AngularFirestoreModule,
                IonicModule.forRoot(PasswordResetPage),
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
        fixture = TestBed.createComponent(PasswordResetPage);
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

    it('it should create the password reset page', () => {
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
        let emailCtrl = component.resetForm.controls['email'];
        emailCtrl.setValue(email);

        expect(emailCtrl.value).toEqual(email);
        expect(emailCtrl.valid).toBeFalsy();
        expect(emailCtrl.getError('wrongDomain')).toBeTruthy();
        expect(component.resetForm.valid).toBeFalsy();
    });

    it('should expect the email testemail@my.uwi.edu to be valid', () => {
        let email = 'testemail@my.uwi.edu';
        let emailCtrl = component.resetForm.controls['email'];
        emailCtrl.setValue(email);

        expect(emailCtrl.value).toEqual(email);
        expect(emailCtrl.valid).toBeTruthy();
        expect(emailCtrl.getError('wrongDomain')).toBeNull();
        expect(component.resetForm.valid).toBeTruthy();
    });

});