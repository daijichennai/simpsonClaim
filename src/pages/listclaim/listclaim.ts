import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
@IonicPage()
@Component({
  selector: 'page-listclaim',
  templateUrl: 'listclaim.html',
})
export class ListclaimPage {
  public claimJson: any;
  public isClaimAvailable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider
  ) {

  }

  ionViewDidLoad() {
    this.storage.get('lsCustCode').then((custCode) => {
      this.getListClaimByCustCode(custCode);
    });    
  }

  goToHome(){
    this.navCtrl.setRoot('HomePage');
  }

  goToClaimDetails(claimID){
    this.navCtrl.push('ClaimdetailsPage',{
      "claimID": claimID
    });
  }

  getListClaimByCustCode(custCode) {
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/RequestClaim.php?MasData=" + custCode;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        if(result.length!=0){
          this.isClaimAvailable = false;
          this.claimJson = result;
        }else{
          this.isClaimAvailable = true;
        }
        
        loader.dismiss();
      }, error => {
          this.isClaimAvailable = true;
        loader.dismiss();
        console.log(error);
        //alert('Error in List Claim');
      });
    });
  }

  onSearch(event) {
    console.log(event.target.value);
    var searchTxt = event.target.value;
    if (searchTxt != '' && searchTxt != null && searchTxt != undefined) {
      this.claimJson = this.claimJson.filter((item) => {
        return item.invoice_no.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1 || item.claim_status.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1;
      });
    } else {
      this.claimJson = null;
      this.storage.get('lsCustCode').then((custCode) => {
        this.getListClaimByCustCode(custCode);
      });
    }
  }
}
