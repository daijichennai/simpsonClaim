import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
@IonicPage()
@Component({
  selector: 'page-coupondetails',
  templateUrl: 'coupondetails.html',
})
export class CoupondetailsPage {
  public serialNo;
  public mode;
  public qrValue;
  public couponDetailsJson: any;
  public isAvailable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider,
    private storage: Storage,
    public toast: ToastController,
  ) {
    this.serialNo = this.navParams.get('serialNo');
    this.mode = this.navParams.get('mode');
    this.qrValue = this.navParams.get('qrValue');
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  ionViewDidLoad() {
    if (this.mode ==="couponScan"){
      this.getCouponDetailsByQrScan(this.qrValue);
    }else{
      this.getCouponDetailsBySerialNo(this.serialNo);
    }
    
  }

  getCouponDetailsBySerialNo(serialNo){
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/coupon_detail_api.php?serial_no=" + serialNo;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        if (result.length != 0) {
          this.isAvailable = false;
          this.couponDetailsJson = result;
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


  getCouponDetailsByQrScan(qrValue) {
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/coupon_detail_api.php?qr_value=" + qrValue;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        if (result.length != 0) {
          this.isAvailable = false;
          this.couponDetailsJson = result;
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


  createClaim(){
    //alert(this.qrValue);
    this.storage.get('lsCustCode').then((custCode) => {

      //alert(custCode);

      let data: Observable<any>;
      let url = this.myFunc.domainURL + 'WarrantyAppAPI/coupon_claim_update.php?qr_value=' + this.qrValue + "&dealerCode=" + custCode;
      //var queryParams = JSON.stringify({ qr_value: this.qrValue, dealerCode: custCode });
      let loader = this.loadingCtrl.create({
        content: 'Creating Claim...'
      });
      data = this.http.post(url, "");
      loader.present().then(() => {
        data.subscribe(result => {
          console.log(result);
          loader.dismiss();
          //alert(JSON.stringify(result));
          if (result[0].print_status === "1"){
            this.toastMsgFn("Claim Created Successfully...");
          }
          this.navCtrl.setRoot('HomePage');
        }, error => {
          console.log(error);
          alert(error.message);
          loader.dismiss();
        });
      });
    });    
  }

  toastMsgFn(msg: string) {
    this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
    }).present();
  }

}
