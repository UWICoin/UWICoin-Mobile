import { Component } from '@angular/core';

/**
 * Generated class for the PullToRefreshComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pull-to-refresh',
  templateUrl: 'pull-to-refresh.html'
})
export class PullToRefreshComponent {

  text: string;

  constructor() {
    this.text = 'Pull to Refresh';
  }

}
