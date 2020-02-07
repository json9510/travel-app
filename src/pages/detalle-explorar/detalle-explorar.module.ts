import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleExplorarPage } from './detalle-explorar';

@NgModule({
  declarations: [
    DetalleExplorarPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleExplorarPage),
  ],
})
export class DetalleExplorarPageModule {}
