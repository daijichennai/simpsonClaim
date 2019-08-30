import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoupondetailsPage } from './coupondetails';

@NgModule({
  declarations: [
    CoupondetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CoupondetailsPage),
  ],
})
export class CoupondetailsPageModule {}
