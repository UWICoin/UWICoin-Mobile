import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionsPage } from './transactions';
import { PullToRefreshModule } from '../../components/pull-to-refresh/pull-to-refresh.module';

@NgModule({
  declarations: [
    TransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionsPage),
    PullToRefreshModule
  ]
})
export class TransactionsPageModule {}
