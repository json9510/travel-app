import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { DetalleProveedorPage } from '../detalle-proveedor/detalle-proveedor';

@Component({
  selector: 'page-proveedores',
  templateUrl: 'proveedores.html'
})
export class ProveedoresPage {

	companies: any;
	loading: any;	
	public currentDate: String;	

  constructor(public navCtrl: NavController, public backendProvider:BackendProvider, public loadingCtrl: LoadingController) {
  }
  
	ionViewDidLoad() {
		this.getCompanies();  
	}
  
  getCompanies() {  
  	
	this.loading = this.loadingCtrl.create();	
	let getUrl = this.backendProvider.apiServer + "/companies-list/";
	
	this.loading.present().then(() => {
         this.backendProvider.getData(getUrl).then(response => {
			this.companies = response;
			this.loading.dismiss();
  		});
   });	
  }  

  	openDetalleProveedorPage(id) {
    	this.navCtrl.push(DetalleProveedorPage, { id: id });
	}  

}
