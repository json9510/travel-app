import { Component, ViewChild } from '@angular/core';
import { SuperTabs } from 'ionic2-super-tabs';
import { LoadingController, NavController, ModalController, Slides } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { BackendProvider } from '../../providers/backend/backend';
import { DetallePaquetePage } from '../detalle-paquete/detalle-paquete';
import { FiltroPage } from '../filtro/filtro';
import { DetalleExplorarPage } from '../detalle-explorar/detalle-explorar';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	cruiserPackages: any;
	nationalPackages: any;
	internationalPackages: any;
	searchPackages: any = {};
	keyword: String;
	previousPackages: any = {};
	loading: any;
	paginator: any = { limit: 10, page: 1 };
	filters: any = {};
	showCancelButton: boolean = false;
	infiniteScroll: any;
	next: any;
	public category: string = 'national';
	categoriesPackages: any;
	public categories: Array<string> = ['national', 'international', 'cruiser']

	constructor(
		public navCtrl: NavController,
		public backendProvider: BackendProvider,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController
	) {
		// let getUrl = this.backendProvider.apiServer + "/categories/top.json";
		// console.log(getUrl);

		// this.backendProvider.getData(getUrl).then(response => {
		// 	this.categoriesPackages = response['categories'];
			
		// 	for (let i = 0; i < this.categories.length; i++) {
		// 		if (this.categoriesPackages[i].name == "Nacionales") {
		// 			this.nationalPackages = this.categoriesPackages[i].child_categories;
		// 		}else if(this.categoriesPackages[i].name == "Internacionales"){
		// 			this.internationalPackages = this.categoriesPackages[i].child_categories;
		// 		}
		// 	}
		// });
	}

	ionViewDidEnter() {
		this.getPackages();
	}

	showLoader() {
		this.loading = this.loadingCtrl.create({
			content: 'Cargando...'
		});
		this.loading.present();
	}

	getPackages() {
		this.showLoader();
		let getUrlNational = this.backendProvider.apiServer + "/get-packages-national/";

		this.backendProvider.getData(getUrlNational).then(response => {
			this.nationalPackages = response;
			this.loading.dismiss();
		});

		let getUrlInternaational = this.backendProvider.apiServer + "/get-packages-international/";

		this.backendProvider.getData(getUrlInternaational).then(response => {
			this.internationalPackages = response;
		});

		let getUrlCruiser = this.backendProvider.apiServer + "/get-packages-cruiser/";

		this.backendProvider.getData(getUrlCruiser).then(response => {
			console.log(response)
			this.cruiserPackages = response;
		});


	}

	paramSerializer(obj) {
		var str = "";
		for (var key in obj) {
			if (str != "") {
				str += "&";
			}
			str += key + "=" + encodeURIComponent(obj[key]);
		}
		return str;
	}

	openFilters() {
		let profileModal = this.modalCtrl.create(FiltroPage, { 'filters': this.filters });
		profileModal.onDidDismiss(data => {
			if (Object.keys(data).length > 0) {
				this.filters = data;
				this.paginator.page = 1;
				this.getPackages();
			}
		});
		profileModal.present();
	}

	doRefresh(refresher) {
		this.previousPackages = {};
		this.paginator = { limit: 10, page: 1 };
		this.getPackages();
		refresher.complete();
	}

	doInfinite(infiniteScroll) {
		// if (this.packages.length > 0){ 
		// 	this.previousPackages = this.packages; 
		// }
		// this.paginator.page++;
		// this.infiniteScroll = infiniteScroll;
		// this.getPackages();
	}

	openDetallePaquetePage(id) {
		this.navCtrl.push(DetallePaquetePage, { id: id });
	}

	globalSearch() {
		if ((this.keyword != "") && (this.keyword != null)) {
			this.filters['title'] = this.keyword
			this.paginator.page = 1;
			this.getPackages();
			this.showCancelButton = true;
		}
	}

	searchCancel(ev: any) {
		delete this.filters['title'];
		this.paginator.page = 1;
		this.getPackages();
		this.showCancelButton = false;
	}

	localSearch(ev: any) {
		//this.packages = this.searchPackages;
		const val = ev.target.value;

		// if the value is an empty string don't filter the items
		// if (val && val.trim() != '') {
		// 	this.packages = this.packages.filter((item) => {
		// 		return (item.tittle.toLowerCase().indexOf(val.toLowerCase()) > -1);
		// 	})
		// }
	}

	onTabChanged(tabName) {
		this.category = tabName;
	}

	
	getChildCategories(category) {
		this.navCtrl.push(DetalleExplorarPage, { category_id: category });
	}
}

