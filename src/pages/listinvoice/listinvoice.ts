import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

@IonicPage()
@Component({
  selector: 'page-listinvoice',
  templateUrl: 'listinvoice.html',
})
export class ListinvoicePage {
  public invoiceJson: any;
  public isInvAvailable:boolean =false;
  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: HttpClient,
        private storage: Storage,
        private loadingCtrl: LoadingController,
        private myFunc: CommfuncProvider
      ) 
    {
      
  }

  ionViewDidLoad() {
    this.storage.get('lsCustCode').then((custCode) => {
      this.getInvoiceByCustCode(custCode);
    });    
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

goToInvoiceDetails(invoiceNo){
  this.navCtrl.push('InvoicedetailsPage',{
    "invoiceNo" : invoiceNo
  });
}

  getInvoiceByCustCode(custCode) {
    let data: Observable<any>;
    //alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/list_api.php?c_code=" + custCode;
    // alert(url);
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.isInvAvailable = false;
        this.invoiceJson = result;
        loader.dismiss();
      }, error => {
        this.isInvAvailable = true;
        loader.dismiss();        
        console.log(error);
        //alert(error.message);
        //alert('Error in Invoice');
      });
    });
  }

  onSearch(event) {
    console.log(event.target.value);
    var searchTxt = event.target.value;
    if (searchTxt != '' && searchTxt != null && searchTxt != undefined){
      this.invoiceJson = this.invoiceJson.filter((item) => {
        return item.invoice_no.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1;
      });
    }else{
      this.invoiceJson= null;
      this.storage.get('lsCustCode').then((custCode) => {
        this.getInvoiceByCustCode(custCode);
      }); 
    }
  }
}
