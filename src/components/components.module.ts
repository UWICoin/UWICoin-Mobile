import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { UserSummaryComponent } from './user-summary/user-summary';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
		UserSummaryComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		UserSummaryComponent
	]
})
export class ComponentsModule {}
