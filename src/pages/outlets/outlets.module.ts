import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutletsPage } from './outlets';
import { PullToRefreshModule } from '../../components/pull-to-refresh/pull-to-refresh.module';

@NgModule({
  declarations: [
    OutletsPage
  ],
  imports: [
    IonicPageModule.forChild(OutletsPage),
    PullToRefreshModule
  ],
})
export class OutletsPageModule {}
