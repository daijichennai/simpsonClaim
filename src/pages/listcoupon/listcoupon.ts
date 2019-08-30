import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

@IonicPage()
@Component({
  selector: 'page-listcoupon',
  templateUrl: 'listcoupon.html',
})
export class ListcouponPage {
  public couponListJson: any;
  public isAvailable: boolean = false;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private http: HttpClient,
      private storage: Storage,
      private loadingCtrl: LoadingController,
      private myFunc: CommfuncProvider
      ) {
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }
  ionViewDidLoad() {
    this.storage.get('lsCustCode').then((custCode) => {
      this.getListCouponByCustCode(custCode);
    });
  }

  goToClaimDetails(serialNo){
    this.navCtrl.push('CoupondetailsPage',{
      "serialNo"  :serialNo
    });
  }

  getListCouponByCustCode(custCode) {
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/coupon_list_api.php?dealer_code=" + custCode;    
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        if (result.length != 0) {
          this.isAvailable = false;
          this.couponListJson = result;
        } else {
          this.isAvailable = true;
        }
        loader.dismiss();
      }, error => {
          this.isAvailable = true;
        loader.dismiss();
        console.log(error);
        //alert('Error in List Claim');
      });
    });
  }

}
