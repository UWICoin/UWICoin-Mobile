import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { FIREBASE_CONFIG } from '../../firebase.config';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as cryptico from 'cryptico';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'qrcode',
  templateUrl: 'qrcode.html'
})
export class QRCodeComponent implements OnChanges, OnInit {

  @Input('correction') correction: 'L' | 'M' | 'Q' | 'H' = 'M'; // Error correction level
  @Input('margin') margin = 4; // Defines the size of the quiet zone
  @Input('type') type = ''; // The type of output
  @Input('value') value = ''; // The contents to input to the qrcode
  @Input('version') version = '';
  @Input('scale') scale = 4; // The scale factor.
  @Input('width') width = 100; // The width of the qr code, height is equal to width.

  @ViewChild('qrcodeElement') qrcodeElement: ElementRef;

  bits = 1024;
  subscriptions: Subscription;
  key = FIREBASE_CONFIG.apiKey;
  minRefreshInterval = 10;
  refresh = 15;
  rsaKey: any;
  rsaPublicKey: any;
  loading = false;

  constructor(private renderer: Renderer2) {
    this.rsaKey = cryptico.generateRSAKey(this.key, this.bits);
    this.rsaPublicKey = cryptico.publicKeyString(this.rsaKey);
  }

  ngOnInit() {
    if (this.refresh >= this.minRefreshInterval) {
      // Refresh every given seconds
      this.subscriptions = Observable.interval(this.refresh * 1000).subscribe(data => {
        this.createQRCode();
      });
    }
    this.createQRCode();
  }

  ngOnChanges() {
    
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
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

  public decrypt(encrypted: string) {
    const decrypted = cryptico.decrypt(encrypted, this.rsaKey);
    return decrypted;
  }

  public encrypt(plaintxt: string) {
    const encrypted = cryptico.encrypt(plaintxt, this.rsaPublicKey);
    return encrypted.cipher;
  }

  private generateData() {
    const data = JSON.stringify({
      'timestamp': moment(new Date().toISOString()).format('YYYY-MM-DD HH:mm:ss'),
      'interval': this.refresh, 
      'data': this.value
    });
    return this.encrypt(data);
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
            console.log('QRCode: ', error);
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
    this.loading = true;
    let element: Element;
    element = this.renderer.createElement('img');
    this.toDataURL().then((data: string) => {
      // console.log(data);
      element.setAttribute('src', data);
      this.renderElement(element);
      this.loading = false;
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
