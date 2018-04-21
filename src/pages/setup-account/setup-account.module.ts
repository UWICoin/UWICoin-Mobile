import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetupAccountPage } from './setup-account';
import { SpinnerModule } from '../../components/spinner/spinner.module';

@NgModule({
  declarations: [
    SetupAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(SetupAccountPage),
    SpinnerModule
  ],
})
export class SetupAccountPageModule { }
