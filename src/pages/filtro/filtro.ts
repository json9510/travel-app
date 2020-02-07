import { BackendProvider } from './../../providers/backend/backend';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';


/**
 * Generated class for the FiltroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-filtro',
	templateUrl: 'filtro.html',
})
export class FiltroPage {

	order: any = { asc: "", desc: "" };
	lalianxa: boolean = false;
	price: any = { lower: 0, upper: 15000000 };
	nights: any = { lower: 1, upper: 15 };
	season: string = "";
	departure_city:any;
	filters: any;
	loading: any;
	data: any;
	cities = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public loadingCtrl: LoadingController,
		public backendProvider: BackendProvider
	) {
		this.cities = [
			{"id":"","name":"Cualquier ciudad"},
			{"id":"PEI","name":"Pereira"},
			{"id":"BOG","name":"Bogotá"},
			{"id":"MDE","name":"Medellín"},
			{"id":"CLO","name":"Cali"},
			{"id":"BGA","name":"Bucaramanga"},
			{"id":"CTG","name":"Cartagena"},
			{"id":"AXM","name":"Armenia"},
			{"id":"MZL","name":"Manizales"}
		]

		this.filters = navParams.get('filters');
		if(this.filters.departure_city){
			this.departure_city = this.filters.departure_city;
		}
		if(this.filters.min_price){
			this.price.lower = this.filters.min_price;
		}
		if(this.filters.max_price){
			this.price.upper = this.filters.max_price;
		}
		if(this.filters.min_nights){
			this.nights.lower = this.filters.min_nights;
		}
		if(this.filters.max_nights){
			this.nights.upper = this.filters.max_nights
		}
		if(this.filters.direction){
			if (this.filters.direction == "asc") {
				this.order.asc = "active";
				this.order.desc = "";
			} else if (this.filters.direction == "desc") {
				this.order.asc = "";
				this.order.desc = "active";
			}
		}
		if(this.filters.season){
			this.season = this.filters.season;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FiltroPage');
	}

	closeFilters() {
		let data = {};
		this.viewCtrl.dismiss(data);
	}

	orderByPrice(direction) {
		if (direction == "asc") {
			this.order.asc = "active";
			this.order.desc = "";
		} else if (direction == "desc") {
			this.order.asc = "";
			this.order.desc = "active";
		}
	}

	setLalianxa() {
		this.lalianxa = !this.lalianxa;
	}

	applyFilters() {
		let data = {}
		if (this.order.asc == "active") {
			data["sort"] = "double_price";
			data["direction"] = "asc";
		} else if (this.order.desc == "active") {
			data["sort"] = "double_price";
			data["direction"] = "desc";
		}
		if (this.price.lower != 0) { data["min_price"] = this.price.lower; }
		if (this.price.upper != 15000000) { data["max_price"] = this.price.upper; }
		if (this.nights.lower != 1) { data["min_nights"] = this.nights.lower; }
		if (this.nights.upper != 15) { data["max_nights"] = this.nights.upper; }
		if (this.season != '') { data["season"] = this.season; }
		if (this.lalianxa) { data["association"] = 'lalianxa'; }
		if (this.departure_city){data["departure_city"] = this.departure_city};
		this.viewCtrl.dismiss(data);
	}

	clearFilters() {
		this.order.asc = this.order.desc = this.season = "";
		this.lalianxa = false;
		this.price = { lower: 0, upper: 15000000 };
		this.nights = { lower: 1, upper: 15 };
		this.departure_city = "PEI"
	}
}