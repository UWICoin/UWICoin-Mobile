import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AppPreferences } from '@ionic-native/app-preferences';
import { AuthenticationProvider } from './../providers/authentication/authentication';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { ComponentsModule } from '../components/components.module';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorHandler, NgModule } from '@angular/core';
import { FIREBASE_CONFIG } from './../firebase.config';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RippleLibProvider } from '../providers/ripple-lib/ripple-lib';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ToastProvider } from '../providers/toast/toast';
import { FCM } from "@ionic-native/fcm";
import { CacheModule } from 'ionic-cache';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserModule,
    ComponentsModule,
    FormsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    CacheModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'arrow-back',
      scrollAssist: false,
      autoFocusAssist: false
    }),
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    AppPreferences,
    AuthenticationProvider,
    Camera,
    DatabaseProvider,
    ImagePicker,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RippleLibProvider,
    ToastProvider,
    FCM
  ]
})
export class AppModule { }
