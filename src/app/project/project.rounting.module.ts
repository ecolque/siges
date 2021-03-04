import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AgregateComponent } from './agregate/agregate.component';

import { RegisterComponent } from './../register/register.component';
import { RegisterEditComponent } from './../register/register-edit/register-edit.component';
import { RegisterListComponent } from './../register/register-list/register-list.component';
import { FamilyComponent } from './../register/family/family.component';

import { RegisterEditResolver } from './../register/register-edit/guards/register.edit.resolver';
import { DomicilioComponent } from './../register/domicilio/domicilio.component';
import { TenenciaComponent } from './../register/tenencia/tenencia.component';
import { AuthGuard } from './../guards/auth.guard';
import { ProjectComponent } from './project.component';


const registerRoutes: Routes = [
   /* { path: 'project', component: ProjectComponent, children:[
        { path: ':id/register', component: RegisterComponent, children:[
          { path: 'list', component:  RegisterListComponent},
          { path: ':id/edit', component: RegisterEditComponent},
          { path: ':id/family', component: FamilyComponent}
        ]},
    ]}
    */
    { path: 'project', component: ProjectComponent, canActivate: [AuthGuard], children: [
        { path: 'register', component: RegisterComponent },
        { path: ':id/list', component: RegisterListComponent},
        { path: ':id/edit', component: RegisterEditComponent, resolve: { register: RegisterEditResolver }},
        { path: ':id/family', component: FamilyComponent},
        { path: ':id/domicilio', component: DomicilioComponent},
        { path: ':id/tenencia', component: TenenciaComponent}
    ]}
];

@NgModule({
  imports: [ RouterModule.forChild(registerRoutes) ],
  exports: [ RouterModule ]
})
export class ProjectRoutingModule {}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
