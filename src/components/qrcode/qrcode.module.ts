import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QRCodeComponent } from './qrcode';
import { SpinnerModule } from '../spinner/spinner.module';
@NgModule({
	declarations: [QRCodeComponent],
	imports: [SpinnerModule, CommonModule, IonicModule],
	exports: [QRCodeComponent]
})
export class QRCodeModule {}
