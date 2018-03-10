import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, OnChanges } from '@angular/core';
import * as QRCode from 'qrcode';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

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

  constructor(private renderer: Renderer2) { }

  ngOnChanges() {
    if (this.refresh && this.refresh >= this.minRefreshInterval) {
      // Refresh every given seconds
      this.emitter = Observable.interval(this.refresh * 1000).subscribe(data => {
        // console.log('qrcode refreshed');
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

  public toDataURL() {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(
        JSON.stringify({
          'timestamp': new Date().toISOString(),
          'interval': this.refresh,
          'data': this.value
        }),
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
            // console.log(url);
            resolve(url);
          }
        });
    });
  }

  public generateImage() {
    let element: Element;
    element = this.renderer.createElement('img');
    this.toDataURL().then((data: string) => {
      // console.log(data);
      element.setAttribute('src', data);
      this.renderElement(element);
    });
  }

  public renderElement(element) {
    // tslint:disable-next-line:prefer-const
    for (let node of this.qrcodeElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcodeElement.nativeElement, node);
    }
    this.renderer.appendChild(this.qrcodeElement.nativeElement, element);
  }

}
