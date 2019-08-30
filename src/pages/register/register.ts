import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { App } from 'ionic-angular';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  authForm: FormGroup;
  public userPassword: string;
  public userName: string;
  public fullUserName: string;
  public custCode: string;
  public type = 'password';
  public showPass = false;
  public mobileNo: string;
  public mobileModel: string;
  public mobileSerialNo:string;
  public FCMID: any;
  constructor(
          public navCtrl: NavController,
          public navParams: NavParams,
          public fb: FormBuilder,
          public sim: Sim,
          public device: Device,
          public http: HttpClient,
          private toastCtrl: ToastController,
          public app: App, 
          private storage: Storage,
          public myFunc: CommfuncProvider,
          public loadingCtrl: LoadingController,
      )
    {
      this.authForm = fb.group({
        'chkFullUserName': [null, Validators.compose([Validators.required])],
        'chkCustCode': [null, Validators.compose([Validators.required])],
        'chkUserName': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        'chkUserPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      });

  }

  ionViewDidLoad() {
    this.SimRead()
  }

  SimRead() {
    this.sim.getSimInfo().then(
      (info) => this.mobileNo = info.phoneNumber,
      (err) => { 
        console.log(err);
        //alert(JSON.stringify(err));
      }
    );

    this.sim.hasReadPermission().then(
      (info) => console.log(info)
    );

    this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );
    this.mobileModel = this.device.model;
    this.mobileSerialNo = this.device.serial;
  }

  registerFn(){
    let data: Observable<any>;
    let url= this.myFunc.domainURL + 'WarrantyAppAPI/Applogin.php?LGP=0';
    var queryParams = JSON.stringify({ Username: this.userName, CustCode: this.custCode, Password: this.userPassword, FCMID: this.FCMID, MobileSerial: this.mobileSerialNo, MobileModel: this.mobileModel, MobileNumber: this.mobileNo, Name: this.fullUserName });

    let loader = this.loadingCtrl.create({
      content: 'Creating New User'
    });

    data = this.http.post(url, queryParams); 
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        if (result != 0) {
          if (result[0].status != '0') {
            this.storage.set('lsUserID', result[0].id);
            this.storage.set('lsUserPwd', result[0].password);
            this.storage.set('lsUserName', result[0].name);
            this.storage.set('lsCustCode', result[0].customer_code);
            this.navCtrl.setRoot('HomePage');
          } else {
            this.navCtrl.setRoot('LoginPage');
            this.toastMsgFn('Your Account is In-Active');
          }
        } 
        loader.dismiss();
      }, error => {
        console.log(error);
        //alert(error.message);
        loader.dismiss();
      });
    });
  }

  toastMsgFn(msg: string) {
    this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
    }).present();
  }

  showPassword() {
    this.showPass = !this.showPass; 
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
