import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map.component';

const geoRoutes: Routes = [
    { path: '', component: MapComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(geoRoutes) ],
  exports: [ RouterModule ]
})
export class MapRoutingModule {}
