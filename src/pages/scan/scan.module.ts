import { QRCodeModule } from './../../components/qrcode/qrcode.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanPage } from './scan';

@NgModule({
  declarations: [
    ScanPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanPage),
    QRCodeModule
  ],
})
export class ScanModule {}
