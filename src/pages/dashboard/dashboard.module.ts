import { PullToRefreshModule } from './../../components/pull-to-refresh/pull-to-refresh.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    PullToRefreshModule
  ],
})
export class DashboardPageModule { }
