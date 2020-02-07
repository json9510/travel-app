import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';

import { MyApp } from './app.component';

import { RegistroPage } from '../pages/registro/registro';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { ProveedoresPage } from '../pages/proveedores/proveedores';
import { FavoritosPage } from '../pages/favoritos/favoritos';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ExplorarPage } from '../pages/explorar/explorar';
import { DetalleExplorarPage } from '../pages/detalle-explorar/detalle-explorar';
import { ReservarPage } from '../pages/reservar/reservar';
import { ReservasPage } from '../pages/reservas/reservas';
import { DetallePaquetePage } from '../pages/detalle-paquete/detalle-paquete';
import { DetalleProveedorPage } from '../pages/detalle-proveedor/detalle-proveedor';
import { FiltroPage } from '../pages/filtro/filtro';
import { Network } from '@ionic-native/network';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm';
import { SwipeSegmentDirective } from '../directives/swipe-segment.directive';

import { BackendProvider } from '../providers/backend/backend';
import { DatabaseProvider } from '../providers/database/database';
import { ComplementBookingDataPage } from '../pages/complement-booking-data/complement-booking-data';
import { EditBookingDataPage } from '../pages/edit-booking-data/edit-booking-data';
import { MomentPipe } from '../pipes/moment/moment';
import { NetworkProvider } from '../providers/network/network';
import { DetalleReservaPage } from '../pages/detalle-reserva/detalle-reserva';

@NgModule({
  declarations: [
    MyApp,
    RegistroPage,
    LoginPage,
    WelcomePage,
    ProveedoresPage,
    FavoritosPage,
    HomePage,
    TabsPage,
    ExplorarPage,
    DetalleExplorarPage,
    ReservarPage,
    ReservasPage,
    DetallePaquetePage,
    DetalleProveedorPage,
    FiltroPage,
    ComplementBookingDataPage,
    EditBookingDataPage,
    MomentPipe,
    SwipeSegmentDirective,
    DetalleReservaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegistroPage,
    LoginPage,
    WelcomePage,
    ProveedoresPage,
    FavoritosPage,
    HomePage,
    TabsPage,
    ExplorarPage,
    DetalleExplorarPage,
    ReservarPage,
    ReservasPage,
    DetallePaquetePage,
    DetalleProveedorPage,
    FiltroPage,
    ComplementBookingDataPage,
    EditBookingDataPage,
    DetalleReservaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackendProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseProvider,
    SQLite,
    InAppBrowser,
    FCM,
    Network,
    NetworkProvider
  ]
})
export class AppModule { }
