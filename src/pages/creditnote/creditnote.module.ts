import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditnotePage } from './creditnote';

@NgModule({
  declarations: [
    CreditnotePage,
  ],
  imports: [
    IonicPageModule.forChild(CreditnotePage),
  ],
})
export class CreditnotePageModule {}
