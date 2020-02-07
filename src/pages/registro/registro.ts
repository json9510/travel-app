import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginPage } from '../login/login';

/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-registro',
	templateUrl: 'registro.html',
})
export class RegistroPage {

	companies: any;
	loading: any;
	message: string;
	otherCompany = false;
	private userData: FormGroup;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public backendProvider: BackendProvider,
		private formBuilder: FormBuilder,
		public loadingCtrl: LoadingController,
		public alertController: AlertController
	) {

		this.userData = this.formBuilder.group({
			company_id: ['', Validators.required],
			worker_type: [''],
			observations:[''],
			first_name: ['', Validators.required],
			last_name: ['', Validators.required],
			email: ['', Validators.compose([
				Validators.required,
				Validators.email
			])],
			password: ['', Validators.required],
			repassword: ['', Validators.required],
		});

	}

	ionViewDidLoad() {
		this.getCompanies();
	}

	register() {
		this.showLoader("Cargando...");
		let postUrl = this.backendProvider.apiServer + "/users/register.json";
		let result: any;

		this.backendProvider.postData(this.userData.value, postUrl).then(response => {
			result = response['user'];
			if (result.saved) {
				this.message = 'El registro ha sido exitoso. Por favor ingresa con tus nuevas credenciales.';
				this.presentAlert();
				this.navCtrl.push(LoginPage, {}, { animate: false });
			} else {
				this.message = 'El registro no pudo realizarse, por favor intentar nuevamente.';
				this.presentAlert();
			}
			this.loading.dismiss();
		});

	}

	showLoader(msg) {
		this.loading = this.loadingCtrl.create({
			content: msg
		});
		this.loading.present();
	}

	getCompanies() {

		this.showLoader("Cargando...");
		let getUrl = this.backendProvider.apiServer + "/companies/registerSelect.json";
		this.backendProvider.getData(getUrl).then(response => {
			this.companies = response['companies'];

			let element = {
				"id": "other",
				"name": "Otra"
			}
			this.companies.push(element);

			console.log(this.companies)
			this.loading.dismiss();
		});
	}

	async presentAlert() {
		const alert = await this.alertController.create({
			message: this.message,
			buttons: ['OK']
		});

		await alert.present();
	}

	openLoginPage() {
		this.navCtrl.push(LoginPage, {}, { animate: false });
	}

	changeCompany (value) {
		if (value == "other") {
			this.otherCompany = true;
		}else {
			this.otherCompany = false;
		}
		console.log(this.otherCompany)
	}

}
