import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { RegisterRoutingModule } from './register.routing.module';
import { RegisterComponent } from './../register/register.component';

import { RegisterEditComponent } from './../register/register-edit/register-edit.component';
import { RegisterListComponent } from './../register/register-list/register-list.component';

import { PersonComponent } from './../register/person/person.component';
import { FamilyComponent } from './../register/family/family.component';

import { RegisterEditResolver } from './register-edit/guards/register.edit.resolver';
import { FamilyService } from './../services/family.service';
import { FamilyFormComponent } from './../register/family/family-form/family-form.component';
import { DomicilioComponent } from './../register/domicilio/domicilio.component';
import { TenenciaComponent } from './../register/tenencia/tenencia.component';
import { DomicilioService } from './../services/domicilio.service';
import { TenenciaService } from './../services/tenencia.service';
import { FormObsComponent } from './register-list/form-obs/form-obs.component';
import { VerBeneficioComponent } from './../shared/ver-beneficio/ver-beneficio.component';

import { FormReemplazoComponent } from './register-list/form-reemplazo/form-reemplazo.component';
import { FormRenunciaComponent } from './register-list/form-renuncia/form-renuncia.component';

import { MsgModalComponent } from './../shared/utils/msg-modal/msg-modal.component';
import { FormOpenRegistersComponent } from './register-list/form-openregisters/form-openregisters.component';
import { PersonSimilarComponent } from './person/person-similar/person-similiar.component';
import { FuncionarioComponent } from './register-edit/funcionario/funcionario.component';


// import { PersonComponent } from './../register/person/person.component';
// import { AgregateComponent } from './../register/agregate/agregate.component';



// import { RegisterService } from './../services/register.service';
// import { UtilsService } from './../services/utils.service';


// import { RegisterEditComponent } from './register-edit/register.edit.component';
// import { AgregateFormComponent } from './agregate/agregate-form/agregate.form.component';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormOpenprojectComponent } from '../project/form-openproject/form-openproject.component';
import { FormRecordComponent } from './register-list/form-record/form-record.component';
import { FormObsCloseProject } from './register-list/form-obs-closeproject/form-obs-closeproject';
import { FormCreditoComponent } from './register-list/form-credito/form-credito.component';


@NgModule({
    declarations: [
        RegisterComponent,
        RegisterListComponent,
        RegisterEditComponent,
        PersonComponent,
        FamilyComponent,
        FamilyFormComponent,
        DomicilioComponent,
        TenenciaComponent,
        FormObsComponent, VerBeneficioComponent, FormRecordComponent, FormObsCloseProject, FormCreditoComponent,
        FormReemplazoComponent,
        MsgModalComponent,
        FormRenunciaComponent,
        FormOpenRegistersComponent,
        PersonSimilarComponent,
        FormOpenprojectComponent,
        FuncionarioComponent
        // AgregateComponent, //RegisterEditComponent,
        // AgregateFormComponent, ProductionComponent
        ],
    imports: [
        CommonModule,
        FormsModule,
        RegisterRoutingModule,
        NgbModule.forRoot(),
        ReactiveFormsModule
    ],
    entryComponents: [
         FamilyFormComponent,
         FormObsComponent,
         FormObsCloseProject,
         FormReemplazoComponent,
         MsgModalComponent,
         FormRenunciaComponent,
         FormOpenRegistersComponent,
         PersonSimilarComponent,
         FormOpenprojectComponent,
         FuncionarioComponent,
         FormRecordComponent,
         FormCreditoComponent
        ],
    providers: [
        RegisterEditResolver,
        FamilyService,
        DomicilioService,
        TenenciaService
       // RegisterService,
       // UtilsService,
    ],
    bootstrap: []
})
export class RegisterModule {}
