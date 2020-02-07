import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBookingDataPage } from './edit-booking-data';

@NgModule({
  declarations: [
    EditBookingDataPage,
  ],
  imports: [
    IonicPageModule.forChild(EditBookingDataPage),
  ],
})
export class EditBookingDataPageModule {}
