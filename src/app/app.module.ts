import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';

import { AuthenticationProvider } from './../providers/authentication/authentication';

import { MyApp } from './app.component';

import { FIREBASE_CONFIG } from './../firebase.config';
import { ToastProvider } from '../providers/toast/toast';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    ComponentsModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    AuthenticationProvider,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ToastProvider,
  ]
})
export class AppModule { }
