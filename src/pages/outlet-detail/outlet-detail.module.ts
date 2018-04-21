import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutletDetailPage } from './outlet-detail';

@NgModule({
  declarations: [
    OutletDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OutletDetailPage),
  ],
})
export class OutletDetailPageModule {}
