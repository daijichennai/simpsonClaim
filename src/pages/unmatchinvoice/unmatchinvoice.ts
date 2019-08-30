import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

@IonicPage()
@Component({
  selector: 'page-unmatchinvoice',
  templateUrl: 'unmatchinvoice.html',
})
export class UnmatchinvoicePage { 
    public TotSum: any;
    public QrInv: any; 
  constructor(
          public navCtrl: NavController,
          public navParams: NavParams,
          public http: HttpClient,
          public loadingCtrl: LoadingController,
          public alertCtrl: AlertController,
          public storage: Storage,
          public sqlite: SQLite,
          public myFunc: CommfuncProvider,
        ) {
    
  }
  

  ionViewDidLoad() {
    this.getData();
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT COUNT(rowid) AS TotSum FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        this.TotSum = res.rows.item(0).TotSum;
      }).catch(e => console.log(e));
      db.executeSql('SELECT InvoiceNo FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        this.QrInv = res.rows.item(0).InvoiceNo;
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

  }
 

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS WarrentyRequest(rowid INTEGER PRIMARY KEY, timestamp Text, CompanyName TEXT, Address TEXT, InvoiceNo TEXT,InvoiceDate TEXT, UserId TEXT, MaterialCode TEXT ,MaterialName TEXT , warrenty TEXT, Quantity TEXT , Remarks TEXT)', []).then(res => console.log('Executed SQL')).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  Review(RevValue) {
    if (RevValue != 0) {
      this.navCtrl.push('ReviewPage');
    }
    else {
      let altsuccess = this.alertCtrl.create({
        title: 'Alert',
        message: 'No Record To Review..!',
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

  PageChange() {
    this.navCtrl.push('QrcodePage').then(() => {
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
    });
  }

}
