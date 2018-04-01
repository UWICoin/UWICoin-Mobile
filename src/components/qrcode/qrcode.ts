import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as QRCode from 'qrcode';
import * as NodeRSA from 'node-rsa';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'qrcode',
  templateUrl: 'qrcode.html'
})
export class QRCodeComponent implements OnChanges {

  @Input('correction') correction: 'L' | 'M' | 'Q' | 'H' = 'M'; // Error correction level
  @Input('margin') margin = 4; // Defines the size of the quiet zone
  @Input('type') type = ''; // The type of output
  @Input('value') value = ''; // The contents to input to the qrcode
  @Input('version') version = '';
  @Input('scale') scale = 4; // The scale factor.
  @Input('width') width = 100; // The width of the qr code, height is equal to width.
  @Input('refresh') refresh = 0;

  @ViewChild('qrcodeElement') qrcodeElement: ElementRef;
  minRefreshInterval = 10;
  emitter: Subscription;
  key: any;

  constructor(private renderer: Renderer2) {
    this.key = new NodeRSA(`-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgEalK6C9NcITz9drtyn3ktaOhrfx/lBkh9VfBJaqj62KN/z6RLGs
xG15cOat2K6WYXxQGEtWr4QZbWN0Kj8tjsmw/cHgbnzxOwaOOtWzK/ayerEk7H1j
GI9SOGs+InArn7o6IAP52P7ZenNcXHxYJ7JDW9RN1LYfZ20KWySKp1a5AgMBAAEC
gYAxGSJVOKtgEzzkTyyhsjsPe0cOGNXTMctl8//QZwIsbl+zJo0Pny91lm1tJW3v
CPz/1PrNgZXCjZmFAXtLJXKS581C8huxHPvrb5yuEbCKxlVP01wiUmHZ8T8DalJf
MJ6WkvNMVGNFGsvDrp4i3Fdh1rtK543oOQcMgbxSUTLe8QJBAIbaMG7LowyaXS8B
h0gAbMMwe4d9P7Pv2kVeavJIRMHpUWnylcsDc6N6Bi0gVDcdjsQ539RmmFwcHdfl
pPzEdycCQQCGHGdLSjW6Mtu2F8EKNsbvIcwr8l4iPgSkCUEPDSwX0uu9CPJPY9hV
lWv6xlgL2WLLHVwIKZIRLNaCsRjfFW8fAkBG/0jQjFXjpMG6pctblR2uBjCDPOX1
DiqUqwkTVgkdLoG2jglfQQn4352w1HyCKAWqOe4mHX3JwOPVbwpWKfmxAkB0Zl65
GFX9oHrWV1OzO8v6bgk584kEi3OXtHiFSdeFbgox7nvxsCVqUuB/rnto/WskA/2H
EB25ToN4t6FwrrfdAkB+Z18LIyBJ16RwVQIdkWbmO+1p1vDoi1002qzJmE5x6yX3
vRM9Ui3gY+9L9CHB6kAfq+4E5+HaKtzycL2gH1hS
-----END RSA PRIVATE KEY-----`);
  }

  ngOnChanges() {
    if (this.refresh && this.refresh >= this.minRefreshInterval) {
      // Refresh every given seconds
      this.emitter = Observable.interval(this.refresh * 1000).subscribe(data => {
        this.createQRCode();
      });
    }
    this.createQRCode();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.emitter.unsubscribe();
  }

  // Creates a QRCode based on the type selected
  public createQRCode() {
    if (!this.value) {
      return;
    }

    switch (this.type) {
      default:
        this.generateImage();
    }
  }

  private generateData() {
    const data = JSON.stringify({
      'timestamp': new Date().toISOString(),
      'interval': this.refresh,
      'data': this.value
    });
    const encrypted = this.key.encrypt(JSON.stringify(data), 'base64');
    return encrypted;
  }

  private toDataURL() {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(this.generateData(),
        {
          'version': this.version,
          'errorCorrectionLevel': this.correction,
          'scale': this.scale,
          'margin': this.margin,
          'width': this.width
        }, (error, url) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          // tslint:disable-next-line:one-line
          else {
            resolve(url);
          }
        });
    });
  }

  private generateImage() {
    let element: Element;
    element = this.renderer.createElement('img');
    this.toDataURL().then((data: string) => {
      // console.log(data);
      element.setAttribute('src', data);
      this.renderElement(element);
    });
  }

  private renderElement(element) {
    // tslint:disable-next-line:prefer-const
    for (let node of this.qrcodeElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcodeElement.nativeElement, node);
    }
    this.renderer.appendChild(this.qrcodeElement.nativeElement, element);
  }

}
