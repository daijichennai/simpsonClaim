import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { CommfuncProvider } from '../providers/commfunc/commfunc';
import { Network } from '@ionic-native/network';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SQLite } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { Sim } from '@ionic-native/sim';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    BarcodeScanner,
    SQLite,
    Geolocation,
    FileTransfer,
    Camera,
    MediaCapture,
    PhotoLibrary,
    Media,
    File,
    Device,
    Sim,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommfuncProvider
  ]
})
export class AppModule {}
