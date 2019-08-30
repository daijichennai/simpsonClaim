import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-itemexist',
  templateUrl: 'itemexist.html',
})
export class ItemexistPage {
  public Id: any;
  constructor(
          public navCtrl: NavController,
          public navParams: NavParams,
  ) {
    
    this.Id = this.navParams.get('Lclr');

  }

  ionViewDidLoad() {

  } 
  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }


  PageChange() {
    this.navCtrl.push('QrcodePage').then(() => {
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
    });
  }

}
