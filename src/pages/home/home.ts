import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public myFunc: CommfuncProvider
    )
    { 
  }

  ionViewDidLoad() {
    
  }
 
  goToListInvoice(){
    this.navCtrl.push('ListinvoicePage');
  }

  goToListClaims(){
    this.navCtrl.push('ListclaimPage');
  }

  goToQRCode(){
    this.navCtrl.push('QrcodePage');
  }

  goToCreditNote(){
    this.navCtrl.push('CreditnotePage');
  }

  settingFn() {
    this.navCtrl.push('SettingsPage');
  }

  goToCouponList(){
    this.navCtrl.push('ListcouponPage');
  }

  goToCouponScan(){
    this.navCtrl.push('CouponscanPage');
  }

 

}
