import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  public scannedDate: any;
  public totalSum: number = 0;
  public QrInv: any;
  public ShowForm: boolean = false;
  public Expire: boolean = false;
  public Waiting: boolean = false;
  public date: string = new Date().toLocaleString();
  public warrentyType:string;
  public quantity:string;
  public remarks:string;
  public invoiceNo: string;
  public invoiceDate: any;
  public matericalCode: string;
  public materialName: string;
  public companyName: string;
  public address: string;
  authForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public barcodeScanner: BarcodeScanner,
    private myFunc: CommfuncProvider,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public platfrm: Platform,
    public alertCtrl: AlertController,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public sqlite: SQLite,
    public fb: FormBuilder,
    private toastCtrl: ToastController

  ) {

    this.authForm = fb.group({
      'chkMatCode': [null, Validators.compose([Validators.required])],
      'chkWarrenty': [null, Validators.compose([Validators.required])],
      'chkQuantity' : [null, Validators.compose([Validators.required])],
      'chkRemarks' :  [null, Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.date = this.myFunc.getDate();
    this.createLocalDataBase();
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT COUNT(rowid) AS totalSum,InvoiceNo FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        //alert(JSON.stringify(res));
        this.totalSum = res.rows.item(0).totalSum;
        this.QrInv = res.rows.item(0).InvoiceNo;
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  createLocalDataBase() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS WarrentyRequest(rowid INTEGER PRIMARY KEY, timestamp Text, CompanyName TEXT, Address TEXT, InvoiceNo TEXT,InvoiceDate TEXT, UserId TEXT, MaterialCode TEXT ,MaterialName TEXT , warrenty TEXT, Quantity TEXT , Remarks TEXT)', []).then(res => {
        console.log('Executed SQL');
      }).catch(e => {
        console.log(e)
      });
    }).catch(e => console.log(e));
  }

  saveData(){

    this.storage.get('lsUserID').then((userID) => {
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO WarrentyRequest VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?)', [this.date, this.companyName, this.address, this.invoiceNo, this.invoiceDate, userID, this.matericalCode, this.materialName, this.warrentyType, this.quantity, this.remarks])
          .then(res => {
            this.authForm.reset();
            this.scannedDate = '';
            this.goToReview('1');
          }).catch(e => { console.log(e); });
      }).
      catch(error => {
        alert(JSON.stringify(error));
        console.log(error);
      });  
    });

    
  }


  scanQrCode() {
    
    let options = {
      resultDisplayDuration: 0,
      showTorchButton: true,
      showFlipCameraButton: true,
      prompt: "Scanning your QR Code"
    };
    
    this.barcodeScanner.scan(options).then(qrData => {

      if (qrData.cancelled) {
        //alert('true');
        this.toastCtrl.create({
          message: 'Cancelling scan...',
          duration: 2000
        }).present();
        return;
      }

      let scanData = qrData.text;
      let splitInvMat = scanData.split("/");
      // alert(splitInvMat[0]);
      // alert(splitInvMat[1]);
      let invNoFromQueryString = splitInvMat[0];           //  Invoice No
      let materialCodeFromQueryString = splitInvMat[1];    //  Material Code

      // let invNoFromQueryString = this.myFunc.getQueryString("inv_no", qrData.text);
      // let materialCodeFromQueryString = this.myFunc.getQueryString("mat_c", qrData.text);

      // alert('invNoFromQueryString = ' + invNoFromQueryString);
       //alert('materialCodeFromQueryString = ' + materialCodeFromQueryString);

      // if (invNoFromQueryString != undefined) {
      //   this.ShowForm = true;
      // }else {
      //   this.ShowForm = false;
      // }

      let data: Observable<any>;
      let url = this.myFunc.domainURL + "WarrantyAppAPI/GetQRDetails.php?InvoiceNo=" + invNoFromQueryString + "&MaterialCode=" + materialCodeFromQueryString;
      data = this.http.get(url);
      data.subscribe(result => {
        //alert(JSON.stringify(result));
        if (result === null || result.length === 0) {
          this.Expire = false;
          this.Waiting = false;
          this.ShowForm = false;
          this.alertMsgFn('No Data Found..!');
        }else {
          this.ShowForm = true;
        }
        
        // if (result.length === 0) {
        //   this.ShowForm = false;
        //   this.alertMsgFn('No Data Found..!');
        // }

        if (result[0].ref_no == undefined) {
          let matCode = result[0].part_no;
          this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('SELECT COUNT(rowid) AS TotMat FROM WarrentyRequest WHERE MaterialCode=?', [matCode]).then(res => {
              if (res.rows.item(0).TotMat === 0) {
                if (this.QrInv != null) {
                  if (this.QrInv != result[0].invoice_no) {
                    this.navCtrl.push('UnmatchinvoicePage');
                    this.Expire = false;
                    this.Waiting = false;
                    this.ShowForm = false;
                  }
                }
                if (this.QrInv === null || this.QrInv === result[0].invoice_no) {
                  let CurDate: any = new Date(this.date);
                  let invDate: any = new Date(result[0].invoice_date);
                  let resDate: any = (CurDate - invDate) / (24 * 3600 * 1000);
                  // alert('CurDate = ' + CurDate);
                  // alert('resDate = ' + resDate);
                  if (parseInt(resDate) < 15) {
                    this.invoiceNo = result[0].invoice_no;
                    this.invoiceDate = result[0].invoice_date;
                    this.matericalCode = result[0].part_no;
                    this.materialName = result[0].part_description;
                    this.companyName = result[0].customer_name;
                    this.address = result[0].shipped_to;
                  }
                  else {
                    this.Expire = true;
                    this.ShowForm = false;
                    this.Waiting = false;
                  }
                }
              }
              else {
                this.ShowForm = false;
                this.navCtrl.push('ItemexistPage', {
                  Lclr: '0'
                });
              }
            }).catch(e => console.log(e));
          }).catch(e => console.log(e));
        }
        else {
          this.ShowForm = false;
          this.navCtrl.push('ItemexistPage', {
            Lclr: '1'
          });
        }
      }, (error) => {
        this.Expire = false;
        this.Waiting = true;
        this.ShowForm = false;
        //alert(JSON.stringify(error));
      });

    }).catch(err => {
      console.log('Error', err);
    });
  }

  goToReview(RevValue) {
    if (RevValue != 0) {
      this.navCtrl.push('ReviewPage');
    }
    else {
      this.alertMsgFn('No Record To Review..!');
    }
  }

  alertMsgFn(msg: string) {
    let altsuccess = this.alertCtrl.create({
      title: 'Alert',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });
    altsuccess.present();
  }


}
