import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/subscription';

import { RegisterService } from './../../services/register.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormObsComponent } from './form-obs/form-obs.component';
import { FormReemplazoComponent } from './form-reemplazo/form-reemplazo.component';
import { FormRenunciaComponent } from './form-renuncia/form-renuncia.component';
import { FormOpenRegistersComponent } from './form-openregisters/form-openregisters.component';
import { MsgModalComponent } from '../../shared/utils/msg-modal/msg-modal.component';
import { element } from 'protractor';
import { RegisterEditComponent } from './../register-edit/register-edit.component';
import { UtilsService } from '../../services/utils.service';
import { forEach } from '@angular/router/src/utils/collection';
import { FuncionarioComponent } from './../register-edit/funcionario/funcionario.component';
import { FormRecordComponent } from './form-record/form-record.component';
import { FormObsCloseProject } from './form-obs-closeproject/form-obs-closeproject';
import { FormCreditoComponent } from './form-credito/form-credito.component';

import { DocumentosComponent } from '../documentos/documentos.component';

@Component({
  selector: 'app-register-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.css']
})
export class RegisterListComponent implements OnInit {
  inscription: Subscription;
  busy: Subscription;
  busyChageState: Subscription;
  busySegip: Subscription;

  projectId: number;
  project: any;

  registers: any[] = [];
  pages: number;
  page: number;
  limit: number = 300;
  activeSearch: boolean;
  isGetRegisters: boolean;
  register: any;

  setClickedRow: Function;
  selectedRow: Number;
  countRegisters: number;
  countIncialRegisters: number;

  sumAceptados: number;
  sumEspera: number;
  sumRechazados: number;
  sumRenuncias: number;
  sumReasignados: number;
  sumResContractual: number;

  sumConfirmados: number;
  sumInicialConfirmados: number;

  showPoints: boolean;

  error: any;
  URL_PRINT: String;

  constructor(
          private router: Router,
          private route: ActivatedRoute,
          private registerService: RegisterService,
          private modalService: NgbModal
        ) {
          this.setClickedRow = function(index){
            this.selectedRow = index;
          }
        }

  ngOnInit() {
    this.registers = RegisterService.registers;
    this.pages = RegisterService.pages;
    this.page = RegisterService.pageIndex;
      this.inscription = this.route.params.subscribe((params: any) => {
        this.projectId = params['id'];
          if (RegisterService.isSelectedProject) {
             this._resetValues();
             this.getRegisters(this.projectId, 1);
             RegisterService.isSelectedProject = false;
          }
          this.project = RegisterService.selectedProject;
          this.showPoints = this.project.evaluar;
        });

      this.inscription = this.route.queryParams.subscribe(
         (queryParams: any) => {
           this.selectedRow = queryParams['regid'];
         }
      );

      this.sumInicialEstados();
      this.sumEstados();
      this.URL_PRINT = UtilsService.PATH_PRINT;
  }

  add() {
    this.router.navigate(['project', 0, 'edit']);
  }

  edit(register: any) {
    this.register = register;
    this.router.navigate(['project', register['id'], 'edit']);
  }

  delete(id: number, idx: number) {
    this.error = '';
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = 'MENSAJE!';
    modalRef.componentInstance.classHeader = 'bg-warning';
    modalRef.componentInstance.msg = 'Se borrará el registro (lista Inicial y Final se desmarcarán en caso que estén). Pero aún puede postular a otro proyecto. Esta seguro de excluir?';
    modalRef.componentInstance.okBtn = true;
    modalRef.result.then((result) => {
         if (result == 'ok') {
          this.registerService.deleteRegister(id, idx).subscribe(res => this.register = [],
            err => {
              console.log(err);
              this.error = err;
            }
          );
         }
    });
 }
 recorte(reg: any) {
  this.error = '';
  const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
  modalRef.componentInstance.typeMsg = 'MENSAJE!';
  modalRef.componentInstance.classHeader = 'bg-warning';
  modalRef.componentInstance.msg = 'Esta operacion es irreversible, entra en recorte para que postule en otros proyectos?';
  modalRef.componentInstance.okBtn = true;
  modalRef.result.then((result) => {
       if (result == 'ok') {
        this.registerService.recorteRegister(reg.id).subscribe(data => {
          reg.estado = data;
        },
          err => {
            console.log(err);
            this.error = err;
          }
        );
       }
  });
}

  pageChange(page) {
    RegisterService.pageIndex = page;
    if (!this.activeSearch) {
      RegisterService.registers = [];
      this.register = [];
      this.selectedRow = -1;
      this.registerService.registerSelectedEmitter.emit(null);
      this.getRegisters(this.projectId, page);
    }else {
     this.activeSearch = false;
    }
  }

  refresh() {
    this.register = [];
    this.registers = [];
    this.selectedRow = -1;
    this.getRegisters(this.projectId, 1);
  }

  getRegisters(projectId: number, page: number) {
    this.error = null;
    this.isGetRegisters = true;
    this.registerService.getRegisters(projectId, page, this.limit).subscribe(
              registers => {
                this.registers = RegisterService.registers;
                this.pages = RegisterService.pages;
                this.sumEstados();
                this.sumInicialEstados();
                this.isGetRegisters  = false;
              }, error => {
                this.error = error;
                this.isGetRegisters  = false;
                if (error == UtilsService.ERROR) {
                  this.router.navigate(['login']);
                }
            });
  }

  showBeneficio(register: any) {
    this.openFormBeneficio(register);
  }

  saveInicialRegisterSelecteds() {
    this.openConfirmForm('Está seguro esta operacion?', 'MENSAJE!', 'bg-warning', 0);
  }

  saveRegisterSelecteds() {
    this.openConfirmForm('Esta operacion es irreversible, esta de acuerdo en cerrar el REGISTRO?', 'MENSAJE!', 'bg-warning', 1);
  }

  /*checkAll(ev) {
    this.registers.forEach(x => (x.valid == false && x.estado.checkbox == true) ? x.close = ev.target.checked : x.close = false);
  }*/

  /*isAllChecked() {
    let count = 0;
    let countClose = 0;
    this.registers.forEach(x => (x.valid == false && x.estado.checkbox == true) ? count++ : 0);
    countClose = this.registers.filter(x => x.close).length;
    this.countRegisters = countClose;
    return count == countClose;
  }*/

  checkAllInicial(ev) {
    this.registers.forEach(x => (x.inicialValid == false && x.estado.checkbox == true) ? x.inicialClose = ev.target.checked : x.inicialClose = false);
  }

  isAllCheckedInicial() {
    let count = 0;
    let countClose = 0;
    if (this.registers) {
      this.registers.forEach(x => (x.inicialValid == false && x.estado.checkbox == true) ? count++ : 0);
      countClose = this.registers.filter(x => x.inicialClose).length;
      this.countIncialRegisters = countClose;
      return count == countClose;
    }else {
      return 0;
    }
  }

  cancelRenuncia(reg: any) {
    this.openFormRenuncia(reg);
  }

  renunciar(reg: any) {
    this.openFormRenuncia(reg);
  }

  showFormReemplazo(register: any) {
    this.openFormReemplazo(register);
  }

  showFormDocumento(register: any){
    //this.registerService.registerSelectedEmitter.emit(register);
    this.register = register;    
    this.openFormDocumento(register);
  }

  cancelReemplazante(register: any) {
    this.openFormCancelReemplazo(register);
  }

  cambioEstado(reg: any) {
    this.error = null;
    this.busyChageState = this.registerService.cambioEstado(reg.id)
    .subscribe(
      data => {
        reg.estado = data;
      },
      errors => {
         this.error = errors;
         this.registerService.openFormLogin(this.error);
        }
    );
  }

  openRegistersInicial() {
    this.openFormOpenRegisters(0); // 0 inicial
  }

  openRegisters() { // 0 inicial 1 final
    this.openFormOpenRegisters(1);
  }

  validateSegip() {
    this.busySegip = this.registerService.validateSegip(this.projectId, this.page == 0 ? 1 : this.page, this.limit).subscribe(
      registers => {
        this.registers = RegisterService.registers; this.pages = RegisterService.pages;
      }, errors => {
        this.registerService.openFormLogin(this.error);
      },
    );
  }

  verficarBeneficio() {
    console.log(this.projectId, this.page, this.limit);

    this.busy = this.registerService.verificarBeneficios(this.projectId, this.page == 0 ? 1 : this.page, this.limit).subscribe(
                registers => {
                  this.registers = RegisterService.registers; this.pages = RegisterService.pages;
                }, errors => {
                  this.registerService.openFormLogin(this.error);
                },
              );
  }

  showConfirms(){
    this.registers = RegisterService.registers.filter(x => x.inicialValid);
  }
  showAceptados() {
    this.registers = RegisterService.registers.filter(x => x.estado.id === 1 || x.estado.id === 2);
  }
  showReasignados() {
    this.registers = RegisterService.registers.filter(x => x.estado.id === 10);
  }
  showEnEspera() {
    this.registers = RegisterService.registers.filter(x => x.estado.id === 3);
  }  
  showRechazados() {
    this.registers = RegisterService.registers.filter(x => x.estado.id === 5 || x.estado.id === 6);
  }
  showRenuncias() {
    this.registers = RegisterService.registers.filter(x => x.estado.id === 4);
  }
  showResolucion() {
    this.registers = RegisterService.registers.filter(x => x.estado.id === 9);
  }

  showFormEstadoCredito (registerId: number, nombres:string, paterno: string, materno: string, credito: any) {
    const modalReFun = this.modalService.open(FormCreditoComponent, {size: 'lg'});    
    modalReFun.componentInstance.projectId = this.project.id;
    modalReFun.componentInstance.registerId = registerId;
    modalReFun.componentInstance.credito = credito;    
    modalReFun.componentInstance.person = paterno + ' ' + materno + ' ' + nombres;
    modalReFun.result.then((result) => {
      if(result) {
        this.register.credito = result;      
        console.log(result);
      }      
    });
  }
  getFuncionarios(reg: any) {
    const modalReFun = this.modalService.open(FuncionarioComponent, {size: 'lg'});
      modalReFun.componentInstance.paterno = reg.person.paterno;
      modalReFun.componentInstance.materno = reg.person.materno;
      modalReFun.componentInstance.documento = reg.person.document;
      modalReFun.componentInstance.personId = reg.person.id;
      modalReFun.result.then((result) => {
        if (result === 'ok') {
           reg.person.employee = true;
        }
      });
  }

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  }

  showRecord(registerId: number, personId: number){
    this.openFormRecord(registerId, personId);
  }
   
  pregips(){
    this.busySegip = this.registerService.pregips(this.register.id).subscribe(
      data => {
        console.log(data);
      }, errors => {
        console.log(errors);
      },
    );
  }

  compareStr(str1: string, str2: string){
    if(str1 == str2){
      return '';
    }
    return 'text-danger';
  }
  private saveInicialRegisters() {
    this.error = null;
    let arry: any = [];
    this.registers.forEach(element => {
      if (element.inicialClose)
        arry.push(element.id);
    });
    this.busy = this.registerService.closeInicialRegister(arry)
        .subscribe(
          data => {
            this.registers.forEach(element => {
               let res = data.listDeny.find(_ => _.id == element.id);
               console.log(res);
               if (res) {
                 element.error  = res.msg ? ('Falta:' + res.msg) : '' ;
                }
            });

            data.listOk.forEach(elem => {
              let res = this.registers.find(_ => _.id == elem.id);
              if (res) {
                if (res.inicialClose) { res.inicialValid = true; res.error = ''; }
                // this.registers.forEach(_ => {if(_.inicialClose) _.inicialValid = true;});
              }
           });
            // this.registers.forEach(_ => {if(_.inicialClose) _.inicialValid = true;});
            this.sumInicialEstados();
          },
          errors => {
              console.log(errors);
              if (errors == UtilsService.ERROR) {
                 this.registerService.openFormLogin(errors);
              }else {
                this.error = errors;
              }
            }
        );
  }

  private saveRegisters() {
    this.error = null;
    let arry: any = [];
    this.registers.forEach(elem => {
      if (elem.close){
        arry.push(elem.id);
      }
    });
    this.busy = this.registerService.closeRegister(arry)
        .subscribe(
          data => {
            this.registers.forEach(_ => { if (_.close)  _.valid = true; });
            this.sumEstados();
          }, errors => {
              console.log(errors);
              if (errors == UtilsService.ERROR) {
                 this.registerService.openFormLogin(errors);
              }else {
                this.error = errors;
              }
            }
        );
  }

  private openFormBeneficio(register: any) {
    const modalRef = this.modalService.open(FormObsComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.register = register;// JSON.parse(JSON.stringify(register));
    modalRef.componentInstance.projectId = RegisterService.selectedProject.id;
    modalRef.componentInstance.showPoints = this.showPoints;
    modalRef.result.then((result) => {
      this.sumEstados();
    });
  }

  private openFormReemplazo(register: any) {
    const modalRef = this.modalService.open(FormReemplazoComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.register = register;
    modalRef.componentInstance.registers = RegisterService.registers.filter(_ => _.estado.id == 3);
    modalRef.componentInstance.tipoProyId = this.project.tipoProyId;
    modalRef.result.then((result) => {
      this.sumEstados();
    });
  }

  private openFormDocumento(register: any) {
    const modalRef = this.modalService.open(DocumentosComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.register = register;
   /* modalRef.componentInstance.registers = RegisterService.registers.filter(_ => _.estado.id == 3);
    modalRef.result.then((result) => {
      this.sumEstados();
    });*/
  }

  private openFormCancelReemplazo(register: any) {
    const modalRef = this.modalService.open(FormReemplazoComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.register = register;
    modalRef.componentInstance.registers = RegisterService.registers.filter(_ => _.id == register.reemplazante.id);
    modalRef.componentInstance.cancelReemplazo = true;
    modalRef.componentInstance.tipoProyId = this.project.tipoProyId;
    modalRef.result.then((result) => {
      this.sumEstados();
    });
  }

  private openFormRenuncia(register: any) {
    const modalRef = this.modalService.open(FormRenunciaComponent, {size: 'sm', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.register = register;
    modalRef.componentInstance.tipoProyId = this.project.tipoProyId;
    modalRef.result.then((result) => {
      this.sumEstados();
    });
  }

  private openFormOpenRegisters(typeList: number) {// 0 inicial 1 final
    const modalRef = this.modalService.open(FormOpenRegistersComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.typeList = typeList;
    if (typeList === 0) {
      modalRef.componentInstance.registers = JSON.parse(JSON.stringify(this.registers.filter(_ => _.inicialValid)));
    }
    if (typeList === 1) {
      modalRef.componentInstance.registers = JSON.parse(JSON.stringify(this.registers.filter(_ => _.valid)));
    }
    modalRef.result.then((result) => {
         if (result != null) {
            if (typeList === 0) {
              result.forEach(x => {let res = RegisterService.registers.find(obj => obj.id == x); res.inicialValid = false; res.inicialClose = false});
            }
            if (typeList === 1) {
              result.forEach(x => {let res = RegisterService.registers.find(obj => obj.id == x); res.valid = false; res.close = false});
            }
              this.sumEstados();
              this.sumInicialEstados();
         }
     });
  }

  private openFormRecord(registerId: number, personId: number) {
    const modalRef = this.modalService.open(FormRecordComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.registerId = registerId;    
    modalRef.componentInstance.personId = personId;    
  }

  private openConfirmForm(msg: string, typeMsg: string, classHeader: string, typeList: number) {     // 0 inicial 1 final
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = typeMsg;
    modalRef.componentInstance.classHeader = classHeader;
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.okBtn = true;
    modalRef.result.then((result) => {
         if (result == 'ok') {
            if (typeList === 0) {
              this.saveInicialRegisters();
            }
            if (typeList === 1) {
              this.saveRegisters();
            }
         }
    });
  }

  private sumEstados() {
    this.sumAceptados  = 0;
    this.sumEspera = 0
    this.sumRechazados = 0;
    this.sumRenuncias = 0;
    this.sumConfirmados = 0;
    this.sumReasignados = 0;
    this.sumResContractual = 0;
    RegisterService.registers.forEach(x => {
        if (x.estado.id == 1 || x.estado.id == 2) { this.sumAceptados += 1; }
        if (x.estado.id == 3) { this.sumEspera += 1; }
        if (x.estado.id == 5 || x.estado.id == 6) { this.sumRechazados += 1; }
        if (x.estado.id == 4) { this.sumRenuncias += 1; }
        if (x.estado.id == 10) { this.sumReasignados += 1; }
        if (x.estado.id == 9) { this.sumResContractual += 1; }
        if (x.valid) { this.sumConfirmados += 1; }
    });
  }

  private sumInicialEstados() {
    this.sumInicialConfirmados = 0;
    RegisterService.registers.forEach(x => {
        if (x.inicialValid) { this.sumInicialConfirmados += 1; }
    });
  }

  setRegisterSelected(register: any) {
    this.register = register;
    this.registerService.registerSelectedEmitter.emit(register);
    RegisterService.selectedStateId = this.register.estado.id;
  }

  goNext() {
    this.router.navigate(['project', this.register.id, 'edit']);
  }

   private _resetValues() {
    this.activeSearch = true;
    RegisterService.registers = [];
    RegisterService.pageIndex = 0;
    this.registers = [];
    this.pages = 0;
    this.page = 0;

    this.register = [];
    this.selectedRow = -1;
 }

  public sessionClose() {
    this.router.navigate(['/login']);
  }

    // PROJECT CLOSE OPEN
    closeInicialProject() {
      if (this.project.id) {
        this._closeProjectoConfirmForm('Esta operacion es irreversible, esta de acuerdo en cerrar LISTA INICIAL del PROYECTO?', 'MENSAJE!', 'bg-warning', 0);
      }else { console.log('Proyecto null'); }
    }
  
    closeProject() {
      if (this.project.id) {
        this._closeProjectoConfirmForm('Esta operacion es irreversible, esta de acuerdo en cerrar el PROYECTO?', 'MENSAJE!', 'bg-warning', 1);
      }else { console.log('Proyecto null'); }
    }

    private _closeInicialProject() {
      if (this.project.id) {
        this.busy = this.registerService.closeInicialProject({projectId: this.project.id, causal: ''})
        .subscribe(
          data => {
            RegisterService.selectedProject.cerradoInicial = true;
          },
          errors => {
            this.openMsgForm(errors, 'ERROR!', 'bg-danger');
            }
        );
      }else { console.log('Proyecto null'); }
    }
  
    private _closeProject() {
      if (this.project.id) {
        this.busy = this.registerService.closeProject({projectId: this.project.id, causal: ''})
        .subscribe(
          data => {
            if(data && data.length > 0) {
              let auxRegisters = [];          
              data.forEach(el => {
                this.registers.forEach(r => {
                  if(r.id === el.id) {
                    r.error = el.msg;
                    console.log("encontrado " + r.id);

                    if(el.ok) {
                      auxRegisters.push(r);
                    }
                  }                  
                });
              });              
              if(auxRegisters != null) {
                this._openObsForm(auxRegisters);
              }
              this.openMsgForm('Revise la lista y corriga por favor', 'ERROR!', 'bg-danger');
            } else {
              console.log("else");
              RegisterService.selectedProject.cerrado = true;
            }                        
            console.log(data);
          },
          errors => {
            this.openMsgForm(errors, 'ERROR!', 'bg-danger');
            }
        );
      }else { console.log('Proyecto null'); }
    }

    private _closeProjectoConfirmForm(msg: string, typeMsg: string, classHeader: string, isCloseInitial: number) {
      const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
      modalRef.componentInstance.typeMsg = typeMsg;
      modalRef.componentInstance.classHeader = classHeader;
      modalRef.componentInstance.msg = msg;
      modalRef.componentInstance.okBtn = true;
      modalRef.result.then((result) => {
           if (result == 'ok') {
             if (isCloseInitial === 0) {
               this._closeInicialProject();
              }
             if (isCloseInitial === 1) {
               this._closeProject();
              }
           }
      });
    }

    private openMsgForm(msg: string, typeMsg: string, classHeader: string) {
      const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
      modalRef.componentInstance.typeMsg = typeMsg;
      modalRef.componentInstance.classHeader = classHeader;
      modalRef.componentInstance.msg = msg;
    }
    
    private _openObsForm(list: any) {
      const modalRef = this.modalService.open(FormObsCloseProject, {size: 'lg'});
      modalRef.componentInstance.registers = JSON.parse(JSON.stringify(list));
    }
}
