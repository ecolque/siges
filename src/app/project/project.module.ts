import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { RegisterComponent } from './../register/register.component';

import { RegisterEditComponent } from './../register/register-edit/register-edit.component';
import { RegisterRoutingModule } from './../register/register.routing.module';
// import { PersonComponent } from './../register/person/person.component';
// import { AgregateComponent } from './../register/agregate/agregate.component';
import { RegisterModule } from './../register/register.module';

import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project.rounting.module';
import { RegisterService } from './../services/register.service';
// import { UtilsService } from './../services/utils.service';
import { TreeModule } from 'angular-tree-component';

// import { RegisterEditComponent } from './register-edit/register.edit.component';
// import { AgregateFormComponent } from './agregate/agregate-form/agregate.form.component';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        ProjectComponent
        // PersonComponent,
        // AgregateComponent, //RegisterEditComponent,
        // AgregateFormComponent, ProductionComponent
        ],
    imports: [
        CommonModule,
        FormsModule,
        // ReactiveFormsModule,
        RegisterModule,
        TreeModule,
        ProjectRoutingModule,
        NgbModule.forRoot()
        ],
    entryComponents: [
          RegisterEditComponent
            ],
    providers: [
        RegisterService, // UtilsService,
        ],
    bootstrap: []
})
export class ProjectModule {}
