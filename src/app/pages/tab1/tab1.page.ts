import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(
    private barcodeScanner: BarcodeScanner,
    private localDataService: LocalDataService
  ) {}

  ionViewWillEnter() {
    this.scan();
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (!barcodeData.cancelled) {
        this.localDataService.guardarRegistro(barcodeData.format, barcodeData.text);
      }
    }).catch(err => {
      console.log('Error: ', err);
    });
  }
}
