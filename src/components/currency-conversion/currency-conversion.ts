import { Component } from '@angular/core';


@Component({
  selector: 'currency-conversion',
  templateUrl: 'currency-conversion.html'
})
export class CurrencyConversionComponent {

  currency: Currency;

  constructor() {
    this.setupTestCurrency();
  }

  setupTestCurrency() {
    this.currency = {
      BDS: '2.00',
      JAM: '127.557',
      USD: '1.00',
      UWI: '1.00',
      TTD: '6.77'
    }
  }

}

export interface Currency {
  BDS: string;
  JAM: string;
  USD: string;
  UWI: string;
  TTD: string;
}
