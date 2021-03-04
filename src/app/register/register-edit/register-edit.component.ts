import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UtilsService } from './../../services/utils.service';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { RegisterService } from './../../services/register.service';
import { MsgModalComponent } from './../../shared/utils/msg-modal/msg-modal.component';
import { FuncionarioComponent } from './funcionario/funcionario.component';

@Component({
  selector: 'app-register-edit',
  templateUrl: './register-edit.component.html',
  styleUrls: ['./register-edit.component.css']
})
export class RegisterEditComponent implements OnInit {
  register: any;
  inscription: Subscription;
  busy: Subscription;

  personFormGroup: FormGroup;

  bgClass: string;
  errors: any= [];

  msgOk: string = 'Datos correctamente GUARDADOS';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private registerService: RegisterService,
    private modalService: NgbModal
    // public activeModal: NgbActiveModal
    // private modalService: NgbModal
    ) { }
   ngOnInit() {
     this.inscription = this.route.data.subscribe(
         (data: {register: any}) => {
           // this.register = JSON.parse(JSON.stringify(data.register));
           this.register = JSON.parse(JSON.stringify(data.register));
            this.setParameters();
         }
       );
  }

  setParameters() {
    if (this.register.person.id > 0) {
      this.register.person.genero = UtilsService.getGenderById(this.register.person.genero.id);
      this.register.person.estadoCivil = UtilsService.getMaritalStatusById(this.register.person.estadoCivil.id);
      this.register.person.tipoDoc = UtilsService.getTypeDocumentById(this.register.person.tipoDoc.id);
      this.register.person.expedido = UtilsService.getDepartamentosById(this.register.person.expedido.id);
      this.register.person.deptNac = UtilsService.getDepartamentosById(this.register.person.deptNac.id);
      this.register.person.provNac = UtilsService.getProvinciasById(this.register.person.provNac.id);
      this.register.person.tipoDiscapacidad = UtilsService.getTipoDiscapacidadesByObj(this.register.person.tipoDiscapacidad);
      this.register.person.tipoFamilia = UtilsService.getTipoFamiliasByObj(this.register.person.tipoFamilia);
      this.register.person.actEconomica = UtilsService.getactividadEconomicasByObj(this.register.person.actEconomica);

      this.register.person.grado = UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.gradoInstruccion, this.register.person.grado);
      if(RegisterService.selectedProject.yearId == 2019) {
        if(this.register.person.gradoDiscapacidad != null && this.register.person.gradoDiscapacidad.id > 0){
          this.register.person.gradoDiscapacidad = {id: 62, name: "Discapacidad (SI)", input: false};
        }
      }

      if(RegisterService.selectedProject.yearId == 2018) {
        this.register.person.gradoDiscapacidad = UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.gradoDiscapacidad, this.register.person.gradoDiscapacidad);
      }      
      this.register.person.respFam = UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.responsableHogar, this.register.person.respFam);
      // RegisterService.selectedProject.evaluacionId
    }

    this.personFormGroup = this.fb.group(this.register.person);
  }
  saveRegister(person: any): void {
    console.log('======RegisterEditComponent saveRegister');
    this.register.person = person;
    this.register.metricaId = RegisterService.selectedProject.metricaId;
    console.log(this.register);
    this.resetError();
    this.required(this.register);
    if (this.register.id == 0) {
          this.busy = this.registerService.newRegister(this.register)
                              .subscribe(
                                data => {
                                  this.register = data;
                                  // this.goNext();
                                  // RegisterService.isSelectedProject = true;
                                  this.setParameters();
                                  if (this.register.id && (this.register.person.residenciaPermanente || this.register.person.viviendaPropia)) {
                                    this.router.navigate(['project', this.register.id, 'family']);
                                  }else {
                                    this.openMsgForm(this.msgOk, 'MENSAJE!!', 'bg-success', false);
                                  }
                                },
                                errs => {
                                    if (errs == UtilsService.ERROR) {
                                      this.registerService.openFormLogin(errs);
                                    }else {
                                          if (errs === 'funcionario') {
                                            this.openMsgForm('ESTA REGISTRADO COMO FUNCIONARIO EN LA AEV', 'Advertencia', 'bg-warning', true);
                                          }else if (Array.isArray(errs)) {
                                            UtilsService.setFormGroupErrors(this.personFormGroup, errs);
                                            this.notifyError(errs, 'bg-danger');
                                          }else {
                                            this.openMsgForm(errs, 'ERROR!', 'bg-danger', false);
                                          }
                                    }
                                  console.log(errs);
                                }
                              );
    }else {
      this.editRegister(this.register);
    }
  }

  editRegister(reg: any): void {
      this.required(this.register);
      this.busy = this.registerService.updateRegister(reg)
                      .subscribe(
                        data => {
                          this.register = data;
                          this.setParameters();
                          this.openMsgForm(this.msgOk, 'MENSAJE!!', 'bg-success', false);
                        },
                        errs => {
                              if (errs == UtilsService.ERROR) {
                                this.registerService.openFormLogin(errs);
                              }else {
                                    if (errs === 'funcionario') {
                                      this.openMsgForm('ESTA REGISTRADO COMO FUNCIONARIO EN LA AEV', 'Advertencia', 'bg-warning', true);
                                    }else if (Array.isArray(errs)) {
                                      UtilsService.setFormGroupErrors(this.personFormGroup, errs);
                                      this.notifyError(errs, 'bg-danger');
                                    }else {
                                      this.openMsgForm(errs, 'ERROR!', 'bg-danger', false);
                                    }
                              }
                            console.log(errs);
                          }
                      );
  }

  private required(register: any) {
    let obj = UtilsService.getObjRegister().person;
    if (!register.person.fnac.year) {
      register.person.fnac = obj.fnac;
    }
    /*if(!register.person.munNac.id){
       register.person.munNac = obj.munNac;
    } */
  }

  private openMsgForm(msg: string, typeMsg: string, classHeader: string, showBtn: boolean) {
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = typeMsg;
    modalRef.componentInstance.classHeader = classHeader;
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.showBtn = showBtn;
    // modalRef.componentInstance.okBtn = showBtn;
    modalRef.result.then((result) => {
      if (result === 'detail') {
        console.log(this.register);
        const modalReFun = this.modalService.open(FuncionarioComponent, {size: 'lg'});
        modalReFun.componentInstance.paterno = this.register.person.paterno;
        modalReFun.componentInstance.materno = this.register.person.materno;
        modalReFun.componentInstance.documento = this.register.person.document;
        modalReFun.componentInstance.personId = this.register.person.id;
        modalReFun.result.then((res) => {
          if (res === 'ok') {
            this.register.person.empConfirm = true;
            this.register.person.employee = true;
            // if(this.register.person.id === 0)
              this.saveRegister(this.register.person);
            // this.openMsgForm(this.msgOk, "MENSAJE!!", "bg-success", false);
          }
        });
      }
    });
  }

  private notifyError(msg: any, cls: string) {
    this.errors = msg;
    this.bgClass = cls;
  }
  private resetError() {
    this.errors = null;
  }

  goNext() {
    this.router.navigate(['project', this.register.id, 'family']);
  }

  goBack() {
    this.router.navigate(['project', RegisterService.selectedProject.id, 'list'], { queryParams: { regid: this.register.id }});
  }
}
