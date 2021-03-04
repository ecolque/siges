import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UtilsService } from './../../services/utils.service';
import { FamilyService } from './../../services/family.service';
import { FamilyFormComponent } from './../family/family-form/family-form.component';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { RegisterService } from './../../services/register.service';
import { MsgModalComponent } from '../../shared/utils/msg-modal/msg-modal.component';
import { FuncionarioComponent } from './../register-edit/funcionario/funcionario.component';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {
  people: any[] = [];
  credito: any[] = [];
  inscription: Subscription;
  registerId: number;
  busy: Subscription;
  busySegip: Subscription;

  setClickedRow: Function;
  selectedRow: Number = -1;

  totalIngresos: number;
  showIngresos: boolean;
  showCredito: boolean;

  bgClass: string;
  errors: any= [];

  form: FormGroup;
  // formCredito: FormGroup;

  constructor(
      private familyService: FamilyService,
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private modalService: NgbModal,
      private fb: FormBuilder
  ) {

    this.setClickedRow = function(index){
        this.selectedRow = index;
    }
  }

  ngOnInit() {
     this.inscription = this.route.params.subscribe((params: any) => {
        this.registerId = params['id'];
        this.showIngresos = UtilsService.showComponente(RegisterService.selectedProject.tipoProyId, UtilsService.aportePatronal);
        this.showCredito = UtilsService.showComponente(RegisterService.selectedProject.tipoProyId, UtilsService.CREDITO);
        this.busy = this.familyService.getFamiliesByRegisterId(this.registerId, RegisterService.personIdSelected, this.showCredito).subscribe(data => {
                                    this.people = this.familyService.families;
                                    this.credito = this.familyService.credito;
                                    console.log(this.credito);
                                    this.setParameters();
                                    this.sumIngresos();
                                  }, error => this.router.navigate(['login']));
      });
  }

  setParameters() {
    this.form = this.fb.group(this.familyService.ingreso);
  }

  ngOnDestroy() {
    this.inscription.unsubscribe();
  }

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  }

  public addFamily() {
    this.selectedRow = -1;
     let newPerson = UtilsService.getObjRegister().person;
     newPerson.registerId = this.registerId;
     console.log(newPerson);
     this.openFormFamily(newPerson);
  }

  private editFamily(person: any, idx: number) {
      this.openFormFamily(person);
  }

  onSubmitIngreso(obj: any) {
    this.resetError();
    let ingreso = obj.value;
    ingreso.titularId = RegisterService.personIdSelected;
    this.busy = this.inscription = this.familyService.saveIngreso(ingreso)
    .subscribe(
      data => {
          this.setParameters();
          this.router.navigate(['project', this.registerId, 'domicilio']);
          // this.openMsgForm("Datos correctamente GUARDADOS", "MENSAJE!!", "bg-success");
        }, errors => {
          // errors.forEach(element => {
            if (Array.isArray(errors)) {
              UtilsService.setFormGroupErrors(this.form, errors);
              this.notifyError(errors, 'bg-danger');
            }else if (errors == UtilsService.ERROR) {
              this.router.navigate(['login']);
            }else {
              this.openMsgForm(errors, 'ERROR!', 'bg-danger');
            }
          // });
        console.log(errors);
      }
    );
  }

  goNext() {
    this.router.navigate(['project', this.registerId, 'domicilio']);
  }

  goBack() {
    this.router.navigate(['project', this.registerId, 'edit']);
  }

  validateSegip() {
    this.busySegip = this.familyService.validateSegip(this.registerId, RegisterService.personIdSelected).subscribe(
      registers => {
        this.people = this.familyService.families;
      }, errors => {
        // this.router.navigate(['login'])
          if (errors == UtilsService.ERROR) {
            // this.openFormLogin(errors);
          }else {
            this.openMsgForm(errors, 'ERROR!', 'bg-danger');
          }
      },
    );
  }
  /*private deletePerson(personId:number){
      this.people.splice(idx, 1);
  }*/

  getEmployee(person: any) {
    const modalReFun = this.modalService.open(FuncionarioComponent, {size: 'lg'});
      modalReFun.componentInstance.paterno = person.paterno;
      modalReFun.componentInstance.materno = person.materno;
      modalReFun.componentInstance.documento = person.document;
      modalReFun.componentInstance.personId = person.id;
      modalReFun.result.then((result) => {
        if (result === 'ok') {
           person.employee = true;
        }
      });
  }

  private sumIngresos() {
    this.totalIngresos = 0;
    this.familyService.families.forEach(x => { this.totalIngresos += x.ingreso });
    let temp = RegisterService.registers.find(obj => obj.id == this.registerId).person.ingreso;
    if (temp) {
      this.totalIngresos += temp;
    }
    return this.totalIngresos;
  }

  private deleteFamily(id: number, idx: number) {
    this.resetError();
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = 'MENSAJE!';
    modalRef.componentInstance.classHeader = 'bg-warning';
    modalRef.componentInstance.msg = 'Esta seguro de eliminar?';
    modalRef.componentInstance.okBtn = true;
    modalRef.result.then((result) => {
         if (result === 'ok') {
          this.familyService.deleteFamily(id, idx, this.registerId).subscribe(
            register => console.log('DELETE OK'),
            error => {
              console.log(error);
              this.notifyError([{msg: error}], 'bg-danger');
            }
          );
         }
    });
  }

  private openFormFamily(person: any) {
    const modalRef = this.modalService.open(FamilyFormComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.person = JSON.parse(JSON.stringify(person));
    modalRef.result.then((result) => {
         if (result != null) {
           // method(result, this.people, idx);
           this.people = this.familyService.families;
         }
         this.sumIngresos();
      });
  }

  private notifyError(msg: any, cls: string) {
    this.errors = msg;
    this.bgClass = cls;
  }

  private resetError() {
    this.errors = null;
  }

  private openMsgForm(msg: string, typeMsg: string, classHeader: string) {
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = typeMsg;
    modalRef.componentInstance.classHeader = classHeader;
    modalRef.componentInstance.msg = msg;
    // modalRef.componentInstance.projectId = RegisterService.selectedProject.id;
    /*modalRef.result.then((result)=>{
         if(result != null){
           //method(result, this.people, idx);
         }
      }); */
  }
}
