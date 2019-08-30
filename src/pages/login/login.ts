import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  authForm: FormGroup;
  public userPassword: string;
  public userName: string;

  //Start Local Storage variable 
  public lsUserID: string;
  public lsUserPwd: string;
  public lsUserName: string;
  public lsCustCode: string;
  //End  Local Storage variable 

  public type = 'password';
  public showPass = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public http: HttpClient,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public myFunc: CommfuncProvider
  ) {

    this.authForm = fb.group({
      // 'chkUserName': [null, Validators.compose([Validators.required])],
      // 'chkUserPassword': [null, Validators.compose([Validators.required])]
      'chkUserName': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'chkUserPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  ionViewDidLoad() {

  }

  chkLogin() {
    // console.log(this.userName);
    // console.log(this.userPassword);
    let data: Observable<any>;
    let url = this.myFunc.domainURL + 'WarrantyAppAPI/LoginApi.php?LGP=1';
    let queryParams = JSON.stringify({ Username: this.userName, Password: this.userPassword });

    let loader = this.loadingCtrl.create({
      content: 'Verifying User'
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
            this.toastMsgFn('Account In-Active');
          }
        } else {
          this.toastMsgFn('User Name or Password is Invalid');
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
    this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
    }).present();
  }

  goToRegister() {
    this.navCtrl.push('RegisterPage');
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
