import { IBalance } from './../../models/balance/balance.models';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Observable } from 'rxjs/Observable';
import { User } from './../../models/user/user.models';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'user-summary',
  templateUrl: 'user-summary.html'
})
export class UserSummaryComponent implements OnChanges {

  @Input('user')
  user$: Observable<User>;

  @Input('balance')
  balance: Promise<IBalance>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    
  }

}
