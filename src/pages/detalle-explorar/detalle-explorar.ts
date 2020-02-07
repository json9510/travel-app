import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { DetallePaquetePage } from '../detalle-paquete/detalle-paquete';

/**
 * Generated class for the DetalleExplorarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-explorar',
  templateUrl: 'detalle-explorar.html',
})
export class DetalleExplorarPage {

  category_id: any;
  packages: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProvider: BackendProvider, public loadingCtrl: LoadingController) {

    this.category_id = navParams.data.category_id;

  }

  ionViewDidLoad() {
    this.getPackages();
  }

  getPackages() {

    this.loading = this.loadingCtrl.create();
    let getUrl = this.backendProvider.apiServer + "/packages/search.json";
    getUrl += "?category=" + this.category_id;
    console.log(getUrl);

    this.loading.present().then(() => {
      this.backendProvider.getData(getUrl).then(response => {
        this.packages = response['packages'];
        this.loading.dismiss();
      });
    });
  }

  openDetallePaquetePage(id) {
    this.navCtrl.push(DetallePaquetePage, { id: id });
  }

}
