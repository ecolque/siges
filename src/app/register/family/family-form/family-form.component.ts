
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FamilyService } from './../../../services/family.service';
import { UtilsService } from './../../../services/utils.service';
import { RegisterService } from './../../../services/register.service';
import { PersonComponent } from './../../person/person.component';
import { MsgModalComponent } from '../../../shared/utils/msg-modal/msg-modal.component';
import { FuncionarioComponent } from '../../register-edit/funcionario/funcionario.component';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.css']
})
export class FamilyFormComponent implements OnInit {

  person: any;
  busy: Subscription;
  familyFormGroup: FormGroup;
  error: string;

  constructor(
    public activeModal: NgbActiveModal,
    private familyService: FamilyService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (this.person.id > 0) {
        this.person.genero = UtilsService.getGenderById(this.person.genero.id);
        this.person.grado = UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.gradoInstruccion, this.person.grado);
        // this.person.estadoCivil = UtilsService.getMaritalStatusById(this.person.estadoCivil.id);
        this.person.tipoDoc = UtilsService.getTypeDocumentById(this.person.tipoDoc.id);
        this.person.expedido = UtilsService.getDepartamentosById(this.person.expedido.id);
        this.person.deptNac = UtilsService.getDepartamentosById(this.person.deptNac.id);
        this.person.provNac = UtilsService.getProvinciasById(this.person.provNac.id);
        this.person.parentesco = UtilsService.getParentescosById(this.person.parentesco.id);
        this.person.tipoDiscapacidad = UtilsService.getTipoDiscapacidadesByObj(this.person.tipoDiscapacidad);
        this.person.gradoDiscapacidad = UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.gradoDiscapacidad, this.person.gradoDiscapacidad);
        this.person.actEconomica = UtilsService.getactividadEconomicasByObj(this.person.actEconomica);
        // RegisterService.selectedProject.evaluacionId,

        // if(this.person.grado.id == 2)
          // PersonComponent.activeComponentConyugueForm = false;
    }

    this.familyFormGroup = this.fb.group(this.person);
  }

  savePerson(prson: any): void {
    this.error = null;
    prson.titularId = RegisterService.personIdSelected;
    this.required(prson);
    if (prson.id === 0) {
          this.busy = this.familyService.newFamily(prson)
              .subscribe(
                person => {
                    this.person = person;
                    // RegisterService.isSelectedProject = true;
                    this.activeModal.close(this.person);
                  }, errors => {
                    if (errors === UtilsService.ERROR) {
                        this.utilsService.openFormLogin(errors);
                    }else {
                          if (errors === 'funcionario') {
                            this.openMsgForm('ESTA REGISTRADO COMO FUNCIONARIO EN LA AEV', 'Advertencia', 'bg-warning', true, prson);
                          }else if (Array.isArray(errors)) {
                            UtilsService.setFormGroupErrors(this.familyFormGroup, errors);
                          }else {
                            this.error = errors;
                          }
                    }                                                 
                    console.log(errors);
                }
              );
    }else {
      this.editPerson(prson);
    }
  }
  
  editPerson(prson: any): void {
    this.required(prson);
    this.busy = this.familyService.updateFamily(prson)
            .subscribe(
              person => {
                this.person = person;
                this.activeModal.close(null);
              }, errors => {
                    if (errors === UtilsService.ERROR) {
                        this.utilsService.openFormLogin(errors);
                    }else {
                      if (errors === 'funcionario') {
                        this.openMsgForm('ESTA REGISTRADO COMO FUNCIONARIO EN LA AEV', 'Advertencia', 'bg-warning', true, prson);
                      }else if (Array.isArray(errors)) {
                            UtilsService.setFormGroupErrors(this.familyFormGroup, errors);
                          }else {
                            this.error = errors;
                          }
                    }
                    console.log(errors);
                }
            );
  }

  private openMsgForm(msg: string, typeMsg: string, classHeader: string, showBtn: boolean, person: any) {
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = typeMsg;
    modalRef.componentInstance.classHeader = classHeader;
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.showBtn = showBtn;
    // modalRef.componentInstance.okBtn = showBtn;
    modalRef.result.then((result) => {
      if (result === 'detail') {
        console.log(this.person);
        const modalReFun = this.modalService.open(FuncionarioComponent, {size: 'lg'});
        modalReFun.componentInstance.paterno = person.paterno;
        modalReFun.componentInstance.materno = person.materno;
        modalReFun.componentInstance.documento = person.document;
        modalReFun.componentInstance.personId = person.id;
        modalReFun.componentInstance.isFamily = true;
        modalReFun.result.then((res) => {
          if (res === 'ok') {
            person.empConfirm = true;
            person.employee = true;
            // if(this.register.person.id === 0)
              this.savePerson(person);
            // this.openMsgForm(this.msgOk, "MENSAJE!!", "bg-success", false);
          }
        });
      }
    });
  }

  private required(person: any) {
    let obj = UtilsService.getObjRegister().person;
    if (!person.fnac) {
      person.fnac = obj.fnac;
    }
    /* if(!person.munNac.id){
       person.munNac = obj.munNac;
    } */
  }

}
