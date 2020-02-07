import { Component } from '@angular/core';

import { ProveedoresPage } from '../proveedores/proveedores';
import { FavoritosPage } from '../favoritos/favoritos';
import { HomePage } from '../home/home';
import { ReservasPage } from '../reservas/reservas';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ProveedoresPage;
  tab3Root = FavoritosPage;
  tab5Root = ReservasPage;
  
  constructor() {

  }
}
