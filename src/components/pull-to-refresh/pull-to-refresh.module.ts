import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PullToRefreshComponent } from './pull-to-refresh';
@NgModule({
	declarations: [PullToRefreshComponent],
	imports: [CommonModule],
	exports: [PullToRefreshComponent]
})
export class PullToRefreshModule {}
