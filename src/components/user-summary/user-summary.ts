import { Component } from '@angular/core';

@Component({
  selector: 'user-summary',
  templateUrl: 'user-summary.html'
})
export class UserSummaryComponent {

  fullName: string;
  balance: number;
  photoURL: string;

  constructor() {
    this.fullName = 'John Doe';
    this.balance = 121.61;
    this.photoURL = 'assets/imgs/avatar.png';
  }

}
