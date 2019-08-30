import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';

const MEDIA_FILES_KEY = 'mediaFiles';
@IonicPage()
@Component({
  selector: 'page-fileupload',
  templateUrl: 'fileupload.html',
})
export class FileuploadPage {
  public id: any;
  public mid: any;

  public Custcode: any;
  public UploadOption: any;
  public ImageName: any;
  public ImageGet: any;
  public ImageCapture: any;
  public Audio: any;
  public Video: any;
  public typee: any;
  public splitted: any;
  public ViewImage: any;
  public date: string = new Date().toLocaleString();
  public Remarks: any;
  public filepath: any;
  public filename: any;
  public Detrowid: any;
  public play: any;
  public url: any;
  public AudioName: any;
  Fileoptions: FileUploadOptions;

  public recording: boolean = false;
  public Sizefile: any;
  public filePath: string;
  public fileName: string;
  public audio: MediaObject;
  public audioList: any[] = [];
  public Fcid: any;
  public Fcmid: any;
  public FileDate: any;
  mediaFiles = [];
  public VideoName: any;
  @ViewChild('myvideo') myVideo: any;
  credentialsForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    private mediaCapture: MediaCapture,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public storage: Storage,
    public alertCtrl: AlertController,
    public camera: Camera,
    public transfer: FileTransfer,
    private file: File,
    public photoLibrary: PhotoLibrary,
    public platform: Platform,
    private media: Media,
    public myFunc: CommfuncProvider
  ) {
    this.id = this.navParams.get('Uid');
    this.mid = this.navParams.get('Mid');
    this.Fcid = this.navParams.get('Uid');
    this.Fcmid = this.navParams.get('Mid');
    //alert(this.mid);
    this.GetImageData(this.id);
    this.ImageGet = 0;
    this.ImageCapture = 0;
    this.Audio = 0;
    this.Video = 0;
    this.storage.get('lsCustCode').then((val) => {
      if (val != '') {
        this.Custcode = val;
      }
    });
    this.credentialsForm = this.formBuilder.group({
      id: [''],
      mid: [''],
      ImageName: [''],
      Remarks: [''],
      AudioName: [''],
      VideoName: [''],
      UploadOption: [''],
      FileDateTime: ['']
    });
    // var date_to_parse = new Date();
    // var year = date_to_parse.getFullYear().toString();
    // var month = (date_to_parse.getMonth() + 1).toLocaleString();
    // var day = date_to_parse.getDate().toLocaleString();
    // var hour = date_to_parse.getHours().toLocaleString();
    // var minute = (date_to_parse.getMinutes() + 1).toLocaleString();
    // var sec = date_to_parse.getSeconds().toLocaleString();
    // this.date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;
    this.date = this.myFunc.getDate();
  }

   goToHome(){
    this.navCtrl.setRoot('HomePage');
  }

  GetImage() {
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    this.camera.getPicture(options).then((imageData) => {
      this.ImageName = 'data:image/jpeg;base64,' + imageData;

      this.photoLibrary.requestAuthorization().then(() => {
        this.photoLibrary.getLibrary().subscribe({
          next: library => {
            library.forEach(function (imageData) {
              if (imageData.fileName != '') {
                this.FileDate = this.myFunc.getDate();
                //alert(this.FileDate);
              }
            });
          },
          error: err => { alert('could not get photos'); },
          complete: () => { alert('done getting photos'); }
        });
      })
        .catch(err => alert('permissions weren\'t granted'));
      loader.dismiss();
    }, (err) => {
      //alert(err);
    });
  }


  TakePhoto() {
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    this.camera.getPicture(options).then((imageData) => {
      this.ImageName = 'data:image/jpeg;base64,' + imageData;
      loader.dismiss();
    }, (err) => {
      //alert(err);
    });
  }

  onSelectChange(Value) {
    if (Value == 'Audio') {
      this.ImageGet = 0;
      this.ImageCapture = 0;
      this.Audio = 1;
      this.Video = 0;
    }
    if (Value == 'Image Gallery') {
      this.ImageGet = 1;
      this.ImageCapture = 0;
      this.Audio = 0;
      this.Video = 0;
    }
    if (Value == 'Image Capture') {
      this.ImageGet = 0;
      this.ImageCapture = 1;
      this.Audio = 0;
      this.Video = 0;
    }
    if (Value == 'Video Capture') {
      this.ImageGet = 0;
      this.ImageCapture = 0;
      this.Audio = 0;
      this.Video = 1;
    }

  }

  saveData() {
    if (this.UploadOption == undefined) {
      this.alertMsgFn('Upload Option Should Not Be Empty..!');
      return false;
    }
    if (this.Remarks == undefined) {
      this.alertMsgFn('Remarks Should Not Be Empty..!');
      return false;
    }
    if (this.ImageName != undefined) {
      this.ImageUpload();
    }
    if (this.AudioName != undefined) {
      this.uploadAudio(this.AudioName);
    }
    if (this.VideoName != undefined) {
      this.storage.get(MEDIA_FILES_KEY).then(res => {
        this.mediaFiles = JSON.parse(res) || [];
        this.VideoName = this.mediaFiles[0].name;
      })
      this.uploadVideo(this.VideoName);
    }
  }

  ImageUpload() {

    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile_' + this.date + '.jpg',
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "multipart/form-data",
      params: { 
          'master_id': this.mid,
          'detail_id': this.id,
          'Option': this.UploadOption,
          'Remarks': this.Remarks,
          'claim_status':'Documents Uploaded'
      }
    }

    fileTransfer.upload(this.ImageName, this.myFunc.domainURL + 'WarrantyAppAPI/uploadImage.php', options)
      .then((data) => {
        this.ionViewDidLoad();
        this.credentialsForm.reset();
        loader.dismiss();
        this.alertMsgFn('Image uploaded successfully..!');
        this.mid = this.Fcmid;
        this.id = this.Fcid;
      }, (err) => {
        alert(err);
        loader.dismiss();
      });

  }

  ionViewDidLoad() {
    this.GetImageData(this.id);
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
      this.VideoName = this.mediaFiles[0].name;
    })
  }

  GetImageData(respon) {
    //alert(respon);
    let data: Observable<any>;
    data = this.http.get(this.myFunc.domainURL + 'WarrantyAppAPI/RequestClaim.php?DataImg=' + respon);
    data.subscribe(result => {
      //alert(result);
      this.typee = result;
    }, (error) => {
      //alert(JSON.stringify(error));
    });
  }
  getAudioList() {
    if (localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      this.AudioName = this.audioList[0].filename;
    }
  }
  ionViewWillEnter() {
    this.getAudioList();
  }
  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.startRecord();
    this.recording = true;
  }
  stopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
  }
  playAudio(file, idx) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    }
    //alert(this.audio.getDuration());  
    this.audio.pause();
    this.play = true;
    this.audio.setVolume(10);
  }
  playPause(file, idx) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.pause();
    this.play = false;

  }

  uploadAudio(file) {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });

    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.Fileoptions = {
      fileKey: 'ionicfile',
      fileName: file,
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "multipart/form-data",
      params: { 
        'master_id': this.mid,
        'detail_id': this.id,
        'Option': this.UploadOption,
        'Remarks': this.Remarks,
        'claim_status':'Documents Uploaded'
      }
    }

    fileTransfer.upload(this.file.externalDataDirectory.replace(/file:\/\//g, '') + file, this.myFunc.domainURL + 'WarrantyAppAPI/uploadImage.php', this.Fileoptions)
      .then((data) => {
        this.ionViewDidLoad();
        localStorage.removeItem('audiolist');
        this.credentialsForm.reset();
        loader.dismiss();
        this.alertMsgFn('Audio uploaded successfully..!');
        this.mid = this.Fcmid;
        this.id = this.Fcid;
      }, (err) => {
        console.log(err);
        loader.dismiss();
      });
  }
  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
      var toDirectory = this.file.dataDirectory;

      this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then((res) => {
        this.storeMediaFiles([{ name: fileName, size: capturedFile.size }]);
      }, err => {
        console.log('err: ', err);
      });
    },
      (err: CaptureError) => console.error(err));
  }
  playVideo(myFile) {
    let path = this.file.dataDirectory + myFile.name;
    let url = path.replace(/^file:\/\//, '');
    let video = this.myVideo.nativeElement;
    video.src = url;
    //alert(video.src);
    video.play();
  }
  storeMediaFiles(files) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
      }
      this.mediaFiles = this.mediaFiles.concat(files);

    })
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
      //alert(this.mediaFiles);
      this.VideoName = this.mediaFiles[0].name;
    })
  }

  uploadVideo(file) {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    //alert(this.file.dataDirectory.replace(/file:\/\//g, '') + file);
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.Fileoptions = {
      fileKey: 'ionicfile',
      fileName: file,
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "multipart/form-data",
      params: { 
        'master_id': this.mid,
        'detail_id': this.id,
        'Option': this.UploadOption,
        'Remarks': this.Remarks,
        'claim_status':'Documents Uploaded'
      }
    }

    fileTransfer.upload(this.file.dataDirectory.replace(/file:\/\//g, '') + file, this.myFunc.domainURL + 'WarrantyAppAPI/uploadImage.php', this.Fileoptions)
      .then((data) => {
        //alert(JSON.stringify(data));
        this.ionViewDidLoad();
        this.storage.set(MEDIA_FILES_KEY, '');
        localStorage.removeItem('audiolist');
        this.credentialsForm.reset();
        loader.dismiss();
        this.alertMsgFn('Video uploaded successfully..!');       
        this.mid = this.Fcmid;
        this.id = this.Fcid;
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.storage.set(MEDIA_FILES_KEY, '');
        localStorage.removeItem('audiolist');
        //alert(JSON.stringify(err));
      });
  }
  onKeyUp() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
      //alert(this.mediaFiles);
      this.VideoName = this.mediaFiles[0].name;
    })
  }

  alertMsgFn(msg){
    let altsuccess = this.alertCtrl.create({
      title: 'Success',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //this.navCtrl.push(CreditListPage);
          }
        }
      ]
    });
    altsuccess.present();
  }

}
