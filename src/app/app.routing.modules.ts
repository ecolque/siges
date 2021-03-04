
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
// import { ReportComponent } from './report/report.component';
// import { ManagementComponent } from './management/management.component';


// import { RegisterComponent } from './register/register.component';
// import { AgregateComponent } from './register-detail/agregate/agregate.component';
// import { RegisterDetailComponent } from './register-detail/register-detail.component';



const routes: Routes = [
  { path: 'login', component : LoginComponent },
  { path: 'report', loadChildren : 'app/report/report.module#ReportModule', canActivate : [AuthGuard] },
  { path: 'search', loadChildren : 'app/search/search.module#SearchModule', canActivate : [AuthGuard] },
  { path: 'geo', loadChildren : 'app/geo/geo.module#GeoModule', canActivate : [AuthGuard] },
  { path: 'management', loadChildren : 'app/management/management.module#ManagementModule', canActivate : [AuthGuard] },
  { path: 'maps', loadChildren : 'app/maps/map.module#MapModule', canActivate : [AuthGuard] },
  { path: 'home', component : HomeComponent, canActivate : [AuthGuard] },
  // { path: '', component: ProjectComponent, pathMatch: 'full'},
  { path: '', component : HomeComponent, canActivate : [AuthGuard] },
  { path: '**', component : HomeComponent, canActivate : [AuthGuard] }
  // { path: '**', component: PageNotFoundComponent }
  // { path: '', redirectTo: '/register', pathMatch: 'full' },
  // { path: 'register',  component: RegisterComponent },
  // { path: 'register/:id', component: RegisterDetailComponent }
  /*{ path: 'agregate', component: AgregateComponent },*/
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ], //
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/