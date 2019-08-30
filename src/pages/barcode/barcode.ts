import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-barcode',
  templateUrl: 'barcode.html',
})
export class BarcodePage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('BarcodePage');
  }

}
