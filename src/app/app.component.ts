import { TabsPage } from './../pages/tabs/tabs';

import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import { LoginPage } from '../pages/login/login';
import { DetalleReservaPage } from '../pages/detalle-reserva/detalle-reserva';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  text: any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private fcm: FCM,
    public events: Events,
    public alertCtrl: AlertController,
    public network: Network,
    public networkProvider: NetworkProvider
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.networkProvider.initializeNetworkEvents();

      // Offline event
      this.events.subscribe('network:offline', () => {
        this.text = "Algunas funcionalidades se pueden ver afectadas"
        this.showAlert();
      });

      // Online event
      this.events.subscribe('network:online', () => {
        
      });
      this.fcm.getToken().then(token => {
        console.log(token);
      });
      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
      });
      this.fcm.onNotification().subscribe(data=>{
        if(data.wasTapped){
          console.log("Received in background")
        } else {
          console.log("Received in foreground");
        };
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
    });
  }
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Error con la conexión a internet',
      subTitle: this.text,
      buttons: ['OK']
    });
    alert.present();
  }
}
