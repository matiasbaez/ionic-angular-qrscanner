import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPage } from './mapa.page';
import { MapaPageRoutingModule } from './mapa-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageRoutingModule,
  ],
  declarations: [MapaPage]
})
export class MapaPageModule {}
