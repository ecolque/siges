import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { RegisterService } from './../../services/register.service';
import { DomicilioService } from './../../services/domicilio.service';
import { UtilsService } from './../../services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';

import { Observable } from 'rxjs/Observable';
import { MsgModalComponent } from '../../shared/utils/msg-modal/msg-modal.component';
import { HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.css']
})
export class DomicilioComponent implements OnInit {
  inscription: Subscription;
  registerId: number = 0;
  urbano: boolean;
  rural: boolean;
  mixto: boolean;
  domicilio: any;
  busy: Subscription;
  busy1: Subscription;
  showCaracteristica: boolean = false;

  zonas: any[]= [];
  caracteristica: any;
  categorias: any[]= [];
  datos: any[]= [];

  respaldos: any[]= [];

  form: FormGroup;

  bgClass: string;
  errors: any= [];

  tipoProyId: number;

  selectedFile: File = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private domicilioService: DomicilioService,
    private modalService: NgbModal,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.inscription = this.route.params.subscribe((params: any) => {
       this.registerId = params['id'];
       console.log(this.registerId);
       this.busy = this.domicilioService.getDomicilioByRegisterId(this.registerId).subscribe(
         data => {
           this.domicilio = DomicilioService.domicilio;
           this.respaldos = DomicilioService.respaldos;
            this.setParameters();
            console.log(this.respaldos);
        }, error => {
          this.router.navigate(['login']);
        });

         this.urbano = RegisterService.selectedProject.urbano;
         this.rural = RegisterService.selectedProject.rural;
         this.mixto = RegisterService.selectedProject.mixto;
         this.tipoProyId = RegisterService.selectedProject.tipoProyId;

         console.log(RegisterService.selectedProject);

         this.showCaracteristica = UtilsService.showComponente(RegisterService.selectedProject.tipoProyId, UtilsService.caracteristicaVivienda);
      });
  }

  setParameters() {
    this.domicilio.zona = DomicilioService.getZonaByObj(this.domicilio.zona);
    this.domicilio.dato = UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.viviendaResideActualmente, this.domicilio.dato);
    this.form = this.fb.group(this.domicilio);

    this.zonas = DomicilioService.zonas;
    this.datos = UtilsService.getEvaluacionesById(RegisterService.selectedProject.tipoProyId, UtilsService.viviendaResideActualmente);
    this.setParametersCaracteristicas();
  }

  setParametersCaracteristicas() {
    this.categorias = UtilsService.getEvaluacionesById(RegisterService.selectedProject.tipoProyId, UtilsService.caracteristicaVivienda);
    if (this.categorias && !this.categorias.find(obj => obj.id == 0)) {
        this.categorias.splice(0, 0, {id: 0, name: null});
    }

    this.caracteristica =  DomicilioService.getCaracteristicas(this.categorias);
  }

  saveDomicilio(domicilio: any): void {
    this.resetError();
    domicilio.urbano = RegisterService.selectedProject.urbano;
    domicilio.rural = RegisterService.selectedProject.rural;
    domicilio.titularId = RegisterService.personIdSelected;
    this.required(domicilio);
    this.busy = this.domicilioService.newDomicilio(domicilio)
              .subscribe(
                dom => {
                    this.domicilio = dom;
                    this.setParameters();
                    this.openMsgForm('Datos correctamente GUARDADOS', 'MENSAJE!!', 'bg-success');
                }, errors => {
                    if (errors == UtilsService.ERROR) {
                        this.utilsService.openFormLogin(errors);
                    }else {
                          if (Array.isArray(errors)) {
                            UtilsService.setFormGroupErrors(this.form, errors);
                            this.notifyError(errors, 'bg-danger');
                          }else {
                            this.openMsgForm(errors, 'ERROR!', 'bg-danger');
                          }
                    }
                    console.log(errors);
                  }
              );
  }

  /*editDomicilio(domicilio:any):void{
    this.busy = this.domicilioService.updateDomicilio(domicilio)
                    .subscribe(
                      dom => {this.domicilio = dom; this.setParameters();},
                      errors => {
                          if(Array.isArray(errors)){
                              UtilsService.setFormGroupErrors(this.form, errors);
                          }else if(errors == UtilsService.ERROR){
                              //this.openFormLogin(errors);
                          }else{
                            alert(errors);
                          }
                          console.log(errors);
                        }
                    );
  }*/

  saveCaracteristicas() {
    this.resetError();
    console.log(this.caracteristica);
    this.caracteristica.titularId = RegisterService.personIdSelected;
    this.busy1 = this.domicilioService.saveCaracteristicas(this.caracteristica)
    .subscribe(
      data => {
          this.caracteristica = data; this.setParametersCaracteristicas();
          // this.openMsgForm("Datos correctamente GUARDADOS", "MENSAJE!!", "bg-success");
          this.router.navigate(['project', this.registerId, 'tenencia']);
      }, errors => {
          if (errors == UtilsService.ERROR) {
            this.utilsService.openFormLogin(errors);
          }else {
                if (Array.isArray(errors)) {
                  this.errors = errors;
                  this.notifyError(errors, 'bg-danger');
                }else {
                  this.openMsgForm(errors, 'ERROR!', 'bg-danger');
                }
          }
            console.log(errors);
        }
    );
  }

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  }

  private openMsgForm(msg: string, typeMsg: string, classHeader: string) {
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = typeMsg;
    modalRef.componentInstance.classHeader = classHeader;
    modalRef.componentInstance.msg = msg;
  }

  formatter = (x: {name: string}) => x.name;
  search = (text$: Observable<string>) =>
  text$.debounceTime(200).map(term => term === '' ? [] : UtilsService.getMunicipalities().filter(v => new RegExp(term, 'gi').test(v.name)).slice(0, 10));

  goNext() {
    this.router.navigate(['project', this.registerId, 'tenencia']);
  }

  goBack() {
    this.router.navigate(['project', this.registerId, 'family']);
  }

  uploadFile(event, respaldo: any){
    console.log(event, respaldo);
    if(event.target.files && event.target.files[0]){
      const file: File = <File>event.target.files[0];
      console.log(file);
  
      const fd = new FormData();
      fd.append('file', file);
      fd.append('registroId', this.registerId.toString());
      fd.append('tipoRespaldoId', respaldo.tipoRespId);
      // fd.append('tipoRespaldoId', '1');
      // fd.append('user_id', this.userId.toString());
      this.busy = this.domicilioService.uploadFile(fd).subscribe( (res: any) => {
        if(res.body){
          try {
            let obj = JSON.parse(res.body);
            respaldo.respName = obj.respName;
            respaldo.respId = obj.respId;
            this.openMsgForm('El archivo se guardo', 'MENSAJE!!', 'bg-success');
          } catch (e) {}
        }
       
      }, e => {
        if(e.statusText){
          console.log(e.statusText)
          this.openMsgForm(e.statusText, 'ERROR!', 'bg-danger');
        }else{
          this.openMsgForm('Error', 'ERROR!', 'bg-danger');
        }
        // alert(e);
        console.log(e);
      });
    }
    // this.onListarDocumentos();        
    // this.archivoElegido;
    
  }

  deleteRespaldo(respaldoId: number, nameFile: string){
    if(confirm("Si eliminas quedara registrado esta accion, borrar?")){
      this.busy = this.domicilioService.deleteFileRespaldo(this.registerId, respaldoId, nameFile).subscribe(res => {
        DomicilioService.respaldos = res;
        this.respaldos = res;
      }, e => {
        this.openMsgForm(e, 'ERROR!', 'bg-danger');
      });
    }
    
  }

  private required(domicilio: any) {
    // let obj = UtilsService.getObjRegister().person;
    if (!domicilio.residencia.id) {
      domicilio.residencia = {id: 0, name: ''};
    }
  }

  private notifyError(msg: any, cls: string) {
    this.errors = msg;
    this.bgClass = cls;
  }
  private resetError() {
    this.errors = null;
  }
}
