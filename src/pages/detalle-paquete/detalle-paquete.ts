import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BackendProvider } from '../../providers/backend/backend';
import { ReservarPage } from '../reservar/reservar';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import Moment from 'moment'

/**
 * Generated class for the DetallePaquetePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var $;
@Component({
	selector: 'page-detalle-paquete',
	templateUrl: 'detalle-paquete.html',
})
export class DetallePaquetePage {
	today = Moment();
	id: any;
	package: any;
	url: any;
	iconosDetalle = {
		isTiquetes: false,
		isTraslados: false,
		isHotel: false,
		isAlimentacion: false,
		isTours: false,
		isImpuestos: false,
		isAsistencia: false,
		isShows: false
	};
	price = "";
	finalPrice = "";
	loading: any;
	public currentDate: String;
	favorite: any;
	pricePosition = 0;
	availabilityPosition = 0;
	firstHotel: any;
	favoritePackageId: any;
	pdf = false;
	available = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public backendProvider: BackendProvider,
		public sanitizer: DomSanitizer,
		private toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		private iab: InAppBrowser) {

		this.id = navParams.data.id;
	}

	ionViewDidLoad() {
		this.getPackage();
	}

	showLoader() {
		this.loading = this.loadingCtrl.create({
			content: 'Cargando...'
		});

		this.loading.present();
	}

	getPackage() {
		let getUrl = this.backendProvider.apiServer + '/package-detail/' + this.id + '/';

		this.storage.get("session").then((data) => {
			this.backendProvider.getPackageFavorite(data.user).then((result: any[]) => {
				if (result.length > 0) {
					for (let index = 0; index < result.length; index++) {
						let packageId = result[index].package;
						if (packageId == this.id) {
							this.favorite = true;
							this.favoritePackageId = result[index].pk;
						} else {
							this.favorite = false
						}
					}
				} else {
					this.favorite = false
				}
			}), (err) => {
				console.log(err);
			};
		})

		this.backendProvider.getData(getUrl).then(response => {
			this.package = response[0];

			this.package.data.features.map(item => {
				if (item.feature.toLowerCase().indexOf('tiquetes') != -1) this.iconosDetalle.isTiquetes = true;
				if (item.feature.toLowerCase().indexOf('traslados') != -1) this.iconosDetalle.isTraslados = true;
				if (item.feature.toLowerCase().indexOf('hotel') != -1) this.iconosDetalle.isHotel = true;
				if (item.feature.toLowerCase().indexOf('alimentacion') != -1) this.iconosDetalle.isAlimentacion = true;
				if (item.feature.toLowerCase().indexOf('tours') != -1) this.iconosDetalle.isTours = true;
				if (item.feature.toLowerCase().indexOf('impuestos') != -1) this.iconosDetalle.isImpuestos = true;
				if (item.feature.toLowerCase().indexOf('asistencia') != -1) this.iconosDetalle.isAsistencia = true;
				if (item.feature.toLowerCase().indexOf('shows') != -1) this.iconosDetalle.isShows = true;
			});

			this.firstHotel = this.package.data.prices[0].pk;
			// if (this.package.video != '') {
			// 	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			// 	var match = this.package.video.match(regExp);
			// 	(match && match[7].length == 11) ? this.package.video = match[7] : false;
			// 	this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.package.video}?autoplay=1&controls=0`);
			// }
			// if (this.package.pdf != null) {
			// 	this.pdf = true;
			// }
			console.log(this.package)
		});
	}

	changeFavoriteState() {
		this.storage.get("session").then((data) => {
			let info = {}
			if (this.favorite == false) {
				info["user_id"] = data.user,
				info["package_id"] = this.id
				console.log(info)
				this.backendProvider.addPackageFavorite(info).then((data) => {

					this.favoritePackageId = data["id_package"];
					let message = "Paquete agregado a la lista de favoritos";
					this.favorite = true;
					this.showToast(message);
				}), (err) => {
					console.log(err);
				};
			} else {
				console.log(this.favoritePackageId)
				info["favorite_id"] = this.favoritePackageId;
				this.backendProvider.removePackageFavorite(info).then((data) => {
					let message = "Paquete removido de favoritos";
					this.favorite = false;
					this.showToast(message);
				}), (err) => {
					console.log(err);
				};
			}
		})
	}

	showToast(message) {

		let toast = this.toastCtrl.create({
			message: message,
			duration: 4000,
		});
		toast.present();
	}

	foodDetails(food) {
		switch (food) {
			case "PC": {
				this.showToast("Plan con desayuno");
				break;
			}
			case "PAM": {
				this.showToast("Plan con desayunos y cenas");
				break;
			}
			case "PA": {
				this.showToast("Plan con desayunos, almuerzos y cenas");
				break;
			}
			case "PAE": {
				this.showToast("Plan con desayunos, almuerzos,cenas, snack en horas de la tarde y licores o cocteles en horarios establecidos");
				break;
			}
			case "FULL": {
				this.showToast("Plan todo incluido. Desayunos, almuerzos y cenas tipo buffet, snacks, bebidas y licores ilimitados");
				break;
			}
			default: {
				this.showToast("No ha sido cargado el tipo de alimentación");
				break;
			}
		}
	}

	openReservarPage(id) {
		this.navCtrl.push(ReservarPage, { package: this.package, pricePosition: this.pricePosition });
	}

	viewPdf() {
		let pdfUrl = encodeURIComponent(this.backendProvider.apiServer + '/' + this.package.pdf_dir + this.package.pdf);
		this.iab.create('https://docs.google.com/viewer?url=' + pdfUrl);
		console.log('pdf url= ' + pdfUrl);
	}

	setCheck(valor, mensaje, currency) {
		this.price = valor;
		let value = valor.split('_');
		$(".icono_list").removeClass("active");
		switch (value[0] + '_' + value[1]) {
			case "single_price":
				$(".icono_single").addClass("active");
				break;
			case "double_price":
				$(".icono_doble").addClass("active");
				break;
			case "triple_price":
				$(".icono_triple").addClass("active");
				break;
			case "quadruple_price":
				$(".icono_cuatruple").addClass("active");
				break;
			case "kid_price":
				$(".icono_nino").addClass("active");
				break;
			default:
				break;
		}

		this.finalPrice = currency + value[2];
		this.showToast(mensaje);
	}

	setPrice(price, index) {
		this.finalPrice = "";
		this.pricePosition = index;
	}

	setAvailability(availability, index) {
		this.availabilityPosition = index;
	}

}
