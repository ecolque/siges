import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AgregateComponent } from './agregate/agregate.component';
import { RegisterComponent } from './register.component';
import { RegisterEditComponent } from './../register/register-edit/register-edit.component';


const registerRoutes: Routes = [ ];

@NgModule({
  imports: [ RouterModule.forChild(registerRoutes) ],
  exports: [ RouterModule ]
})
export class RegisterRoutingModule { }

/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
