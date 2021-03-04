import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';

const managementRoutes: Routes = [
    { path: '', component: ManagementComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(managementRoutes) ],
  exports: [ RouterModule ]
})
export class ManagementRoutingModule {}
