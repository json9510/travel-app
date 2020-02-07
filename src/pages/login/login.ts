import { Component } from '@angular/core';
import { LoadingController, ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BackendProvider } from '../../providers/backend/backend';
import { WelcomePage } from '../welcome/welcome';
import { TabsPage } from '../tabs/tabs';
import { RegistroPage } from '../registro/registro';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	userData = { "username": "", "password": "" };
	backendResponse: any;
	loading: any;
	user: any;
	msg: any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public backendProvider: BackendProvider,
		public loadingCtrl: LoadingController,
		private toastCtrl: ToastController,
		private database: DatabaseProvider,
		public storage: Storage
	) {
		this.verifySession();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	redirect() {
		this.storage.get('splash').then((show) => {
			if(show == true){
				this.navCtrl.setRoot(TabsPage, {}, { animate: false });
			}else{
				this.navCtrl.setRoot(WelcomePage, {}, { animate: false });
			}
		})
	}

	login() {
		this.msg = "Cargando..."
		this.showLoader(this.msg);
		let postUrl = this.backendProvider.apiServer + "/login/";
		
		this.userData["username"] = this.userData["username"].trim();
		this.backendProvider.postData(this.userData, postUrl).then(response => {
			this.backendResponse = response;
			this.loading.dismiss();
			//Storage variable to verify if a user is authenticated
			this.storage.set('session', this.backendResponse);
			this.redirect();
		}, (err) => {
			this.loading.dismiss();
		});
	}

	verifySession() {
		this.msg = "Verificando sesion..."
		this.showLoader(this.msg);
		this.storage.get('session').then((result) => {
			if (result) {
				this.loading.dismiss();
				this.redirect();
			} else {
				this.loading.dismiss();
			}
		});
	}

	showLoader(msg) {
		this.loading = this.loadingCtrl.create({
			content: msg
		});

		this.loading.present();
	}

	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 5000,
			position: 'bottom',
			dismissOnPageChange: true
		});

		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});

		toast.present();
	}


	openRegistroPage() {
		this.navCtrl.push(RegistroPage, {}, { animate: false });
	}

}
