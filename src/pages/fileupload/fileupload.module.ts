import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FileuploadPage } from './fileupload';

@NgModule({
  declarations: [
    FileuploadPage,
  ],
  imports: [
    IonicPageModule.forChild(FileuploadPage),
  ],
})
export class FileuploadPageModule {}
