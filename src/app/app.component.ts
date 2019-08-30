import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;// = 'LoginPage';
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public  splashScreen: SplashScreen,
    public storage: Storage,
    public network: Network,
    public alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.network.onDisconnect().subscribe(() => {
        this.alertFn('Network is disconnected..!')
      });

      this.storage.get('lsUserName').then(result => {
        console.log('lsUserName: ' + result);
        if (result != null && result != undefined) {
          this.rootPage = 'HomePage';
        } else {
          this.rootPage = 'LoginPage';
        }
      });
    });
  }

  alertFn(msg:string){
    let alt = this.alertCtrl.create({
      title: 'Alert',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alt.present();
  }

}

