import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeoComponent } from './geo.component';

const geoRoutes: Routes = [
    { path: '', component: GeoComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(geoRoutes) ],
  exports: [ RouterModule ]
})
export class GeoRoutingModule {}
