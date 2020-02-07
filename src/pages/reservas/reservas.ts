import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ReservasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-reservas',
	templateUrl: 'reservas.html',
})
export class ReservasPage {

	previousBookings: any = {};
	bookings: any;
	loading: any;
	paginator: any = { limit: 7, page: 1 };
	session: any;
	jsonSession: any;
	emptyList: boolean = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private database: DatabaseProvider,
		public backendProvider: BackendProvider,
		public loadingCtrl: LoadingController,
		public storage: Storage) {
	}

	ionViewDidLoad() {
		this.getBookings();
	}

	getBookings() {
		this.storage.get("session").then((data) => {
			this.showLoader();
			let getUrl = this.backendProvider.apiServer + "/bookings/search.json";
			let parameters = this.paramSerializer(this.paginator);
			getUrl += "?user_id=" + data.id + "&" + parameters;
			console.log(getUrl);

			this.loading.present().then(() => {
				this.backendProvider.getData(getUrl).then(response => {
					if (this.previousBookings.length > 0) {
						this.emptyList = false;
						this.bookings = this.previousBookings.concat(response['bookings']);
					} else {
						this.bookings = response['bookings'];
						this.emptyList = true;
					}
					this.loading.dismiss();
				});
			});
		})

	}

	showLoader() {
		this.loading = this.loadingCtrl.create({
			content: 'Cargando...'
		});

		this.loading.present();
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

	doInfinite() {
		if (this.bookings.length > 0) { this.previousBookings = this.bookings; }
		this.paginator.page++;
		this.getBookings();
	}

	doRefresh(refresher) {
		this.previousBookings = {};
		console.log('Begin async operation', refresher);
		this.paginator = { limit: 10, page: 1 };
		this.getBookings();
		refresher.complete();
		console.log('Async operation has ended');
	}

}
