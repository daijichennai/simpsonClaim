import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
  public userID: any;
  public ServerValue: any;
  public reviewJson: any;
  public refNo: any;
  public refDate: any;
  public lat: any;
  public long: any;
  warrentyData: any = [];	

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public http: HttpClient,
      public alertCtrl: AlertController,
      public storage: Storage,
      public sqlite: SQLite,
      public geolocation: Geolocation,
      public myFunc: CommfuncProvider
    ) {
    this.storage.get('lsCustCode').then((val) => {
      if (val != '') {
        this.userID = val;
      }
    });

    if (this.ServerValue == undefined) {
      this.ServerValue = 0;
    }		
  }

  ionViewDidLoad() {
    this.getData();
  }

  goToHome(){
    this.navCtrl.setRoot('HomePage');
  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        this.warrentyData = [];
        for (var i = 0; i < res.rows.length; i++) {
          this.warrentyData.push({
            rowid: res.rows.item(i).rowid, date: res.rows.item(i).timestamp, InvoiceDate: res.rows.item(i).InvoiceDate, CompanyName: res.rows.item(i).CompanyName,
            Address: res.rows.item(i).Address, InvoiceNo: res.rows.item(i).InvoiceNo, UserId: res.rows.item(i).UserId,
            MaterialName: res.rows.item(i).MaterialName, MaterialCode: res.rows.item(i).MaterialCode, warrenty: res.rows.item(i).warrenty,
            Quantity: res.rows.item(i).Quantity, Remarks: res.rows.item(i).Remarks
          })
        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  goToReviewDetails(Vid, SValue) {
    this.navCtrl.push('ReviewdetailsPage', { 
      "Vid": Vid, 
      "Svalue": SValue 
    });
  }

  DeleteData(Did) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are You Sure To Delete Record..!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.sqlite.create({
              name: 'ionicdb.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DELETE FROM WarrentyRequest WHERE rowid=?', [Did])
                .then(res => { })
                .catch(e => console.log(e));
            }).catch(e => console.log(e));
            this.navCtrl.push('QrcodePage').then(() => {
              const startIndex = this.navCtrl.getActive().index - 2;
              this.navCtrl.remove(startIndex, 2);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  AddMore() {
    this.navCtrl.push('QrcodePage').then(() => {
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
    });
  }

  UploadData(Uid, Mid) {
    this.navCtrl.push('FileuploadPage', {
      "Uid": Uid,
      "Mid": Mid
    });
  }

  CreateClaim() {
    let altere = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure to CREATE CLAIM..!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.sqlite.create({
              name: 'ionicdb.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('SELECT * FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
                this.warrentyData = [];
                for (var i = 0; i < res.rows.length; i++) {
                  this.warrentyData.push({
                    CompanyName: res.rows.item(i).CompanyName,
                    Address: res.rows.item(i).Address,
                    InvoiceNo: res.rows.item(i).InvoiceNo,
                    InvoiceDate: res.rows.item(i).InvoiceDate,
                    MaterialCode: res.rows.item(i).MaterialCode, 
                    MaterialName: res.rows.item(i).MaterialName,
                    Quantity: res.rows.item(i).Quantity,
                    warrenty: res.rows.item(i).warrenty,
                    Remarks: res.rows.item(i).Remarks
                  });
                }

                this.storage.get('lsCustCode').then((customerCode) => {
                  if (customerCode != '') {
                    let optionsGPS = { 
                        timeout: 3000,
                        enableHighAccuracy: true 
                    };
                    this.geolocation.getCurrentPosition(optionsGPS).then((resp) => {
                      this.lat = resp.coords.latitude;
                      this.long = resp.coords.longitude;

                      var link = this.myFunc.domainURL +  'WarrantyAppAPI/CreateClaim.php';
                      var myData = JSON.stringify({
                         warrentyData: this.warrentyData,
                         Count: res.rows.length,
                         c_code: customerCode,
                         Latitude: this.lat,
                         Longitude: this.long 
                      });

                      this.http.post(link, myData, { responseType: 'text' }).subscribe(data => {
                        this.ServerValue = data;
                        this.GetServeData(data);
                        db.executeSql('DELETE FROM WarrentyRequest', [])
                          .then(res => {
                          }).catch(e => console.log(e));
                      }, (error) => {
                        //	alert(JSON.stringify(error));
                      });
                      let altsuccess = this.alertCtrl.create({
                        title: 'Success',
                        message: 'Claim Created..!',
                        buttons: [
                          {
                            text: 'OK',
                            handler: () => {
                              this.navCtrl.push('ListclaimPage');
                            }
                          }
                        ]
                      });
                      altsuccess.present();
                    }).catch((error) => {
                      //alert(JSON.stringify(error));
                      let altsuccess = this.alertCtrl.create({
                        title: 'Alert',
                        message: 'Enable Location And Create Claim..!',
                        buttons: [
                          {
                            text: 'OK',
                            handler: () => {
                            }
                          }
                        ]
                      });
                      altsuccess.present();
                    });


                  }
                });

              }).catch(e => console.log(e));
            }).catch(e => console.log(e));
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }

      ]
    });
    altere.present();
  }

  GetServeData(respon) {
    let resvalue = respon.split(',');
    let data: Observable<any>;
    data = this.http.get(this.myFunc.domainURL + 'WarrantyAppAPI/RequestClaim.php?Data=' + respon);
    data.subscribe(result => {
      this.reviewJson = result;
      this.refNo = resvalue[1];
      this.refDate = resvalue[2];
    }, (error) => {
      //alert(JSON.stringify(error));
    });
  }


}
