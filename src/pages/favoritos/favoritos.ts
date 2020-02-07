import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BackendProvider } from '../../providers/backend/backend';
import { DatabaseProvider } from '../../providers/database/database';
import { DetallePaquetePage } from '../detalle-paquete/detalle-paquete';

@Component({
	selector: 'page-favoritos',
	templateUrl: 'favoritos.html'
})
export class FavoritosPage {

	favorites: any;
	packages = [];
	loading: any;
	idsPackages: any;
	emptyList: boolean = true;
	isHeart = 'heart';
	timmer:any;

	constructor(
		public navCtrl: NavController, 
		public backendProvider: BackendProvider, 
		public loadingCtrl: LoadingController, 
		public storage:Storage) {

	}

	ionViewDidEnter() {
		let elem = <HTMLElement>document.querySelector(".tabbar");
		if (elem != null) {
			elem.style.display = 'flex';
		}
		this.getFavorites();
	}

	getFavorites() {
		this.packages = [];
		this.storage.get("session").then((data) => {
			let info = {
				"id":data.id
			}
			this.backendProvider.getPackageFavorite(info).then((data) => {
				if (data["user"].favorites.length > 0) {
					this.emptyList = false;
					for (let index = 0; index < data["user"].favorites.length; index++) {
						console.log(data["user"].favorites[index].package)
						this.packages.push(data["user"].favorites[index].package);
					}
				}
			}), (err) => {
				console.log(err);
			};
		})
	}

	setAnimation(){		
		let obj=this;
		this.timmer=setInterval( function(){
			obj.isHeart= obj.isHeart=='heart-outline' ? 'heart': 'heart-outline';
		}, 800);
	}

	openDetallePaquetePage(id) {
		let elem = <HTMLElement>document.querySelector(".tabbar");
		if (elem != null) {
			elem.style.display = 'none';
		}
		this.navCtrl.push(DetallePaquetePage, { id: id });
	}

	showLoader() {
		this.loading = this.loadingCtrl.create({
			content: 'Cargando...'
		});

		this.loading.present();
	}

}
