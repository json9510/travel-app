import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';

/**
 * Generated class for the DetalleProveedorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detalle-proveedor',
  templateUrl: 'detalle-proveedor.html',
})
export class DetalleProveedorPage {

	id: any;
	company: any;	
	loading: any;
	public currentDate: String;	
		
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public backendProvider:BackendProvider) {
		this.id = navParams.data.id;  
  }

  ionViewDidLoad() {
		this.getCompany();
  }
  
	 getCompany() {  
	 
	 	this.loading = this.loadingCtrl.create();
	 	let getUrl = this.backendProvider.apiServer + '/companies/detail/'+this.id+'.json'; 
		console.log(getUrl);
		
		this.loading.present().then(() => {
			this.backendProvider.getData(getUrl).then(response => {		
				this.company = response['company'];				
				this.loading.dismiss();
			});		
	   });		
	  }	  

}
