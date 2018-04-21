import { RippleLibProvider } from './../../providers/ripple-lib/ripple-lib';
import { IBalance } from './../../models/balance/balance.models';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Observable } from 'rxjs/Observable';
import { IUser } from './../../models/user/user.models';
import { Component } from '@angular/core';

@Component({
	selector: 'user-summary',
	templateUrl: 'user-summary.html'
})
export class UserSummaryComponent {

	user$: Observable<IUser>;
	balance: Observable<IBalance>;

	constructor(private authProvider: AuthenticationProvider,
		private rippleLib: RippleLibProvider) {

		this.user$ = this.authProvider.getUser$();
		this.balance = this.authProvider.getAccount$().switchMap(account => {
			return this.rippleLib.connect().then(() => this.rippleLib.getBalance(account.address));
		});
	}

}
