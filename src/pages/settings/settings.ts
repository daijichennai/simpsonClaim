import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  goToChangePwd() {
    this.navCtrl.push('ChangepwdPage');
  }

  logOutFn() {
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
    this.navCtrl.setRoot("LoginPage");
  }

}
