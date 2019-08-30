import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

@IonicPage()
@Component({
  selector: 'page-creditnote',
  templateUrl: 'creditnote.html',
})
export class CreditnotePage {
  public creditNoteJson: any;
  public isCreditAvailable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public myFunc: CommfuncProvider
  ) {

  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  ionViewDidLoad() {
   this.storage.get('lsCustCode').then((custCode) => {
      this.getCreditNoteDate(custCode);
    });  
  }

   getCreditNoteDate(custCode) {
    let data: Observable<any>;
    let url = this.myFunc.domainURL + "WarrantyAppAPI/WarrentyList.php?CDL=1&ccode=" + custCode;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        if (result.length != 0) {
          this.creditNoteJson = result;
        } else {
          this.isCreditAvailable = true;
        }        
        loader.dismiss();
      }, error => {
          this.isCreditAvailable = true;
        loader.dismiss();
        console.log(error);
        //alert(error.message);
        //alert('Error in Credit Note');
      });
    });
  }

}
