import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-changepwd',
  templateUrl: 'changepwd.html',
})
export class ChangepwdPage {
  authForm: FormGroup;
  public type = 'password';
  public showPass = false;
  public currentPassword:string;
  public newPassword: string;
  public confirmPassword: string;
  public lsUserID:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private storage: Storage,
    public http: HttpClient,
    public toast: ToastController,
    public loadingCtrl: LoadingController,
    public myFunc: CommfuncProvider
  ) {

    this.authForm = fb.group({
      'currentPWD': ['', Validators.compose([Validators.required])],
      'newPWD': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'confirmPWD': ['', Validators.compose([Validators.required, this.equalto('newPWD')])],
    })  
  }

  ionViewDidLoad() { 
    
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  changePwdFn(){

  this.storage.get('lsUserID').then((userID) => {

    let data: Observable<any>;
    let url = this.myFunc.domainURL + 'WarrantyAppAPI/UpdatePassword.php?PUP=1';
    var queryParams= JSON.stringify({ Pword: this.newPassword, UsId: userID });

    let loader = this.loadingCtrl.create({
      content: 'Updating Password...'
    });

    data = this.http.post(url, queryParams);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.storage.clear().then(() => {
          console.log('all keys are cleared');
        });
        this.navCtrl.setRoot("LoginPage"); 
        loader.dismiss();
      }, error => {
        console.log(error);
        loader.dismiss();
      });
    });

  });
}

chkCurrentPWD() {
  this.storage.get('lsUserPwd').then((userPWD) => {
      console.log(userPWD);
      if (userPWD === this.currentPassword){
        // alert("Valid")
      }else{
        this.toastMsgFn('Current Password Not Correct..!');
        this.currentPassword = '';
        // alert("Not Matched")
      }
    }); 
  }


  toastMsgFn(msg: string) {
    this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
    }).present();
  }

  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;

      let isValid = control.root.value[field_name] == input
      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }
}
