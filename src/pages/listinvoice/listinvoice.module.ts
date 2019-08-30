import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListinvoicePage } from './listinvoice';

@NgModule({
  declarations: [
    ListinvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(ListinvoicePage),
  ],
})
export class ListinvoicePageModule {}
