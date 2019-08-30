import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

@IonicPage()
@Component({
  selector: 'page-reviewdetails',
  templateUrl: 'reviewdetails.html',
})
export class ReviewdetailsPage {
  public Id: any;
  public Vid: any;
  public SValue: any;
  public MaterialCode: any;
  public MaterialName: any;
  public MaterialDate: any;
  public MaterialQty: any;
  public MaterialWarrenty: any;
  public MaterialUpload: any;
  public MaterialFile: any;
  public Remarks: any;
  public reviewDetJson: any;
  public RefNo: any;
  public createdDate: any;
  public InvoiceNo: any;
  public claimStatus: any;
  public MasterId: any;
  public DetailId: any;
  warrentyData: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public sqlite: SQLite,
    public storage: Storage,
    public myFunc: CommfuncProvider,
    public loadingCtrl: LoadingController,
  ) {
    this.Id = this.navParams.get('Vid');
    this.SValue = this.navParams.get('Svalue');

  }

  goToHome(){
    this.navCtrl.setRoot('HomePage');
  }
  
  ionViewDidLoad() {
    if (this.SValue == 'Local') {
      this.ReviewDetails(this.Id);
    } else if (this.SValue == 'Server') {
      this.ReviewServeDetails(this.Id);
    }
  }

  ReviewDetails(Vid) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM WarrentyRequest WHERE rowid=?', [Vid]).then(res => {
        //alert(res.rows.item(0).MaterialCode);
        this.MaterialCode = res.rows.item(0).MaterialCode;
        this.createdDate = res.rows.item(0).timestamp;
        this.MaterialName = res.rows.item(0).MaterialName;
        this.MaterialDate = res.rows.item(0).timestamp;
        this.MaterialWarrenty = res.rows.item(0).warrenty;
        this.MaterialQty = res.rows.item(0).Quantity;
        this.Remarks = res.rows.item(0).Remarks;
        this.InvoiceNo = res.rows.item(0).InvoiceNo;
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  ReviewServeDetails(Vid) {
    let data: Observable<any>;
    let loader = this.loadingCtrl.create({
      content: 'Please Wait ...'
    });
    data = this.http.get(this.myFunc.domainURL + 'WarrantyAppAPI/RequestClaim.php?Vid=' + Vid);
    loader.present().then(() => {
      data.subscribe(result => {
        this.MaterialCode = result[0].item_code;
        this.MaterialName = result[0].item_name;
        this.MaterialWarrenty = result[0].warranty_request_type;
        this.MaterialQty = result[0].item_qty;
        this.Remarks = result[0].remarks;
        this.RefNo = result[0].ref_no;
        this.createdDate = result[0].created_date;
        this.InvoiceNo = result[0].invoice_no;
        this.claimStatus = result[0].claim_status;
        this.MasterId = result[0].claim_master_id;
        this.DetailId = result[0].claim_details_id;
        this.ReviewTrackDetails();
        loader.dismiss();
      }, (error) => {
        loader.dismiss();
        //alert(JSON.stringify(error));
      });
    });
  }
  ReviewTrackDetails() {
    let data: Observable<any>;
    let loader = this.loadingCtrl.create({
      content: 'Please Wait ...'
    });
    data = this.http.get(this.myFunc.domainURL + 'WarrantyAppAPI/RequestClaim.php?MasterId=' + this.MasterId + '&DetailId=' + this.DetailId);
    loader.present().then(() => {
      data.subscribe(result => {
        this.reviewDetJson = result;
        loader.dismiss();
      }, (error) => {
        loader.dismiss();
        //alert(JSON.stringify(error));
      });
    });
  }

}
