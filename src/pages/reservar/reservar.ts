import { ActionSheetController } from 'ionic-angular';
import { ComplementBookingDataPage } from './../complement-booking-data/complement-booking-data';
import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, ModalController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { BackendProvider } from '../../providers/backend/backend';
import { DatabaseProvider } from '../../providers/database/database';
import { EditBookingDataPage } from '../edit-booking-data/edit-booking-data';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ReservarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-reservar',
	templateUrl: 'reservar.html',
})
export class ReservarPage {

	package: any;
	loading: any;
	session: any;
	userId: any;
	countData: any;
	countDataChildren: any;
	countDataBaby: any;
	message: string;
	jsonSession: any;
	numberOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	private book: FormGroup;
	pricePosition;
	additionalInfo = [];
	editInfoAdults = [];
	editInfoChildrens = [];
	editInfoBabies = [];

	disabledSelect = false;
	disabledSelectChildren = false;
	disabledSelectBaby = false;
	count = 0;
	countChildren = 0;
	countBaby = 0;

	bedrooms = [];
	bookingAdditionalInfo = [];
	availables = [];

	index = 0;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public backendProvider: BackendProvider,
		public loadingCtrl: LoadingController,
		public alertController: AlertController,
		public modalCtrl: ModalController,
		public actionSheetCtrl: ActionSheetController,
		private database: DatabaseProvider,
		private formBuilder: FormBuilder,
		public storage:Storage
	) {
		this.package = navParams.data.package;
		for (let index = 0; index < this.package.availabilities.length; index++) {
			if (this.package.availabilities[index].available == true) {
				let elements = {
					"id": this.package.availabilities[index].id,
					"start_date": this.package.availabilities[index].start_date,
					"end_date": this.package.availabilities[index].end_date
				}
				this.availables.push(elements);
			}
			
		}
		console.log(this.availables);
		this.pricePosition = navParams.data.pricePosition;
		this.book = this.formBuilder.group({
			package_id: [parseInt(this.package.id)],
			availability_id: ['', Validators.required],
			email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
			phone: ['', Validators.required],
			adults: ['0'],
			children: ['0'],
			babys: ['0'],
			observations: [''],
			price_id: ['', Validators.required],
			bedroom_id: ['', Validators.required]
		});
	}

	ionViewDidLoad() {
	}

	bookForm() {
		this.storage.get("session").then((data) => {
			this.book.value["user_id"] = data.id;

			for (let index = 0; index < this.additionalInfo.length; index++) {
				for (let p = 0; p < this.additionalInfo[index].length; p++) {
					if (this.additionalInfo[index][p].is_principal == true) {
						this.book.value["name"] = this.additionalInfo[index][p].full_name;
					}
				}
			}
			
			this.loading = this.loadingCtrl.create();
			let postUrl = this.backendProvider.apiServer + "/bookings/book.json";
			let result: any;
			this.showLoader();
			
			for (let i = 0; i < this.additionalInfo.length; i++) {
				for (let k = 0; k < this.additionalInfo[i].length; k++) {
					var elements = {
						"birthday_date":this.additionalInfo[i][k].birthday_date,
						"full_name":this.additionalInfo[i][k].full_name,
						"is_principal":this.additionalInfo[i][k].is_principal,
						"number_document":this.additionalInfo[i][k].number_document,
						"type_document":this.additionalInfo[i][k].type_document,
						"type_person":this.additionalInfo[i][k].type_person
					}
					this.bookingAdditionalInfo.push(elements);
				}
			}
	
			this.book.value["booking_details"] = this.bookingAdditionalInfo;
			if(this.book.value.babys == undefined){
				this.book.value.babys = 0;
			}
			if(this.book.value.children == undefined){
				this.book.value.children = 0;
			}
			if(this.book.value.adults == undefined){
				this.book.value.adults = 0;
			}

			console.log(this.book.value)
			this.backendProvider.postData(this.book.value, postUrl).then(response => {
				result = response['booking'];
				if (result.saved) {
					this.message = 'La reserva se realizó exitosamente';
					this.presentAlert();
					this.navCtrl.push(TabsPage, {}, { animate: false });
				} else {
					this.message = 'La reserva no pudo realizarse, por favor intentar nuevamente.';
					this.presentAlert();
				}
				this.loading.dismiss();
			});
		})
	}

	showLoader() {
		this.loading = this.loadingCtrl.create({
			content: 'Guardando Reserva...'
		});
		this.loading.present();
	}

	async presentAlert() {
		const alert = await this.alertController.create({
			message: this.message,
			buttons: ['OK']
		});

		await alert.present();
	}

	openForm(value, type, edit = null) {
		let data = {
			"total": value,
			"type_person": type
		}
		switch (type) {
			case "adults":
				if (value != 0 && this.count == 0 || edit != null) {
					this.openModal(data);
				}
				break;
			case "children":
				if (value != 0 && this.countChildren == 0 || edit != null) {
					this.openModal(data);
				}
				break;
			case "babys":
				if (value != 0 && this.countBaby == 0 || edit != null) {
					this.openModal(data);
				}
				break;
			default:
				break;
		}
	}

	openModal(data) {
		let complementBooking = this.modalCtrl.create(ComplementBookingDataPage, { 'data': data });
		complementBooking.present();
		complementBooking.onDidDismiss(data => {
			if (Object.keys(data).length > 0) {
				this.additionalInfo.push(data);
				for (let p = 0; p < data.length; p++) {
					switch (data[p].type_person) {
						case "adults":
							this.editInfoAdults.push(data[p]);
							this.disabledSelect = true;
							this.countData = this.editInfoAdults.length;
							this.count++;
							break;
						case "children":
							this.editInfoChildrens.push(data[p]);
							this.disabledSelectChildren = true;
							this.countDataChildren = this.editInfoAdults.length;
							this.countChildren++;
							break;
						case "babys":
							this.editInfoBabies.push(data[p]);
							this.disabledSelectBaby = true;
							this.countDataBaby = this.editInfoAdults.length;
							this.countBaby++;
							break;
						default:
							break;
					}

				}
			}
		});
	}

	presentActionSheet(data, position) {
		const actionSheet = this.actionSheetCtrl.create({
			title: 'Seleccione una opción',
			buttons: [
				{
					text: 'editar',
					role: 'edit',
					icon: 'brush',
					handler: () => {
						let editComplementBooking = this.modalCtrl.create(EditBookingDataPage, { 'data': data });
						editComplementBooking.present();
						editComplementBooking.onDidDismiss(data => {
							console.log(data);
						});
					}
				}, {
					text: 'Eliminar',
					role: 'destructive',
					icon: 'trash',
					handler: () => {
						switch (data.type_person) {
							case "adults":
								this.editInfoAdults.splice(position, 1)
								this.countData = this.editInfoAdults.length;
								break;
							case "children":
								this.editInfoChildrens.splice(position, 1)
								this.countDataChildren = this.editInfoAdults.length;
								break;
							case "babys":
								this.editInfoBabies.splice(position, 1)
								this.countDataBaby = this.editInfoAdults.length;
								break;
							default:
								break;
						}
					}
				}, {
					text: 'Cancelar',
					icon: 'close',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}]
		});
		actionSheet.present();
	}

	getPrices(id){
		this.bedrooms = [];
		for (let index = 0; index < this.package.prices.length; index++) {
			let priceId = this.package.prices[index].id;

			if (priceId==id) {
				if (this.package.prices[index].double_price != null) {
					var elements = {
						"code":"double_price",
						"name":"DOBLE",
						"price":this.package.prices[index].double_price
					}
					this.bedrooms.push(elements);
				}

				if (this.package.prices[index].triple_price != null) {
					var elements = {
						"code":"triple_price",
						"name":"TRIPLE",
						"price":this.package.prices[index].double_price
					}
					this.bedrooms.push(elements);
				}

				if (this.package.prices[index].kid_price != null) {
					var elements = {
						"code":"kid_price",
						"name":"NIÑO",
						"price": this.package.prices[index].kid_price
					}
					this.bedrooms.push(elements);
				}

				if (this.package.prices[index].quadruple_price != null) {
					var elements = {
						"code":"quadruple_price",
						"name":"CUADRUPLE",
						"price": this.package.prices[index].quadruple_price
					}
					this.bedrooms.push(elements);
				}

				if (this.package.prices[index].single_price != null) {
					var elements = {
						"code":"single_price",
						"name":"SENCILLA",
						"price": this.package.prices[index].single_price
					}
					this.bedrooms.push(elements);
				}
			}
			
		}
		console.log(this.bedrooms);
	}

}
