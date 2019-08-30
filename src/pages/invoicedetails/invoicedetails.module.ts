import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicedetailsPage } from './invoicedetails';

@NgModule({
  declarations: [
    InvoicedetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoicedetailsPage),
  ],
})
export class InvoicedetailsPageModule {}
