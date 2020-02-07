import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

/**
 * Generated class for the ComplementBookingDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complement-booking-data',
  templateUrl: 'complement-booking-data.html',
})
export class ComplementBookingDataPage {
  data:any;
  peopleInfo = [];
  obj = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.data = navParams.get('data');
    for (let index = 0; index < this.data.total; index++) {
      this.peopleInfo.push({'key':index});
      var elements = {
        "full_name" : "",
        "type_document" : "",
        "number_document":"",
        "type_person":this.data.type_person,
        "birthday_date":"",
        "is_principal":false
      }
      this.obj.push(elements);
    }
  }

  savePeopleData(){
    this.viewCtrl.dismiss(this.obj);
  }

  ionViewDidLoad() {
    this.presentAlert();
  }

  unChecked(i){
    for (let index = 0; index < this.obj.length; index++) {
      if (index != i) {
        this.obj[index].is_principal = false;
      }else{
        this.obj[i].is_principal = true;
      }
    }
  }

  async presentAlert() {
		const alert = await this.alertCtrl.create({
			message: "Por favor ingrese la información de la(s) persona(s).",
			buttons: ['OK']
		});

		await alert.present();
	}

}
