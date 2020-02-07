import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { DetalleExplorarPage } from '../detalle-explorar/detalle-explorar';

/**
 * Generated class for the ExplorarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-explorar',
	templateUrl: 'explorar.html',
})
export class ExplorarPage {

	categories: any;
	loading: any;
	backbutton: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public backendProvider: BackendProvider, public loadingCtrl: LoadingController) {
	}

	ionViewDidLoad() {
		this.getCategories();
	}

	getCategories() {

		this.backbutton = false;
		this.loading = this.loadingCtrl.create();
		let getUrl = this.backendProvider.apiServer + "/categories/top.json";
		console.log(getUrl);

		this.loading.present().then(() => {
			this.backendProvider.getData(getUrl).then(response => {
				this.categories = response['categories'];
				console.log(this.categories);
				this.loading.dismiss();
			});
		});
	}

	getChildCategories(category) {
		if (category.child_categories == undefined || category.child_categories.length < 1) {
			this.openDetalleExplorarPage(category.id);
		} else {
			this.categories = category.child_categories;
			this.backbutton = true;
		}
	}

	openDetalleExplorarPage(id) {
		this.navCtrl.push(DetalleExplorarPage, { category_id: id });
	}

}
