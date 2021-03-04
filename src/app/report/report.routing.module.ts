import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';

const managementRoutes: Routes = [
    { path: '', component: ReportComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(managementRoutes) ],
  exports: [ RouterModule ]
})
export class ReportRoutingModule {}
