import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
@IonicPage()
@Component({
  selector: 'page-couponscan',
  templateUrl: 'couponscan.html',
})
export class CouponscanPage {
  public scannedData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public barcodeScanner: BarcodeScanner,
    public myFunc: CommfuncProvider,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    ) {
  }
  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }
  ionViewDidLoad() {
    
  }

  scanCouponQrCode(){
    let options = {
      resultDisplayDuration: 0,
      showTorchButton: true,
      showFlipCameraButton: true,
      prompt: "Scanning Your QR Code"
    };

    this.barcodeScanner.scan(options).then(qrData => {
      this.scannedData = JSON.stringify(qrData);
      this.chkClaimStatus(qrData.text);
    });

  }

  chkClaimStatus(url){
    let data: Observable<any>;    
    data = this.http.get(url);
      data.subscribe(result => {
        console.log(result);
        // if (result[0].coupon_status ==="Invalid Coupon"){
        //   this.alertMsgFn(result[0].coupon_status,"Failure");
        // }

        if (result[0].coupon_status === "1" && result[0].coupon_status_desc === "Valid") {
          this.navCtrl.push('CoupondetailsPage', {
            "serialNo": result[0].serial_no,
            "qrValue": result[0].invoice_no + "_" + result[0].serial_no + "_" + result[0].part_code + "_" + result[0].dealer_code,
            "mode": "couponScan"
          });
        } else if (result[0].coupon_status_desc === "Invalid"){
          this.alertMsgFn("Invalid Coupon", "Failure");
        } else if (result[0].coupon_status === "2" || result[0].coupon_status === "3" ) {
          this.alertMsgFn("Coupon Already Claimed", "Status");
        }

       

      }, error => {   
          this.alertMsgFn("Invalid QR Code", "Failure");     
        console.log(error);
      });
  }


  alertMsgFn(msg,alertTitle) {
    let altsuccess = this.alertCtrl.create({
      title: alertTitle,
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //this.navCtrl.push(CreditListPage);
          }
        }
      ]
    });
    altsuccess.present();
  }

}
