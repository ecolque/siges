
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { TenenciaService } from './../../services/tenencia.service';
import { RegisterService } from './../../services/register.service';
import { UtilsService } from './../../services/utils.service';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { MsgModalComponent } from '../../shared/utils/msg-modal/msg-modal.component';

@Component({
  selector: 'app-tenencia',
  templateUrl: './tenencia.component.html',
  styleUrls: ['./tenencia.component.css']
})
export class TenenciaComponent implements OnInit, OnDestroy {
  inscription: Subscription;
  registerId: number;
  busy: Subscription;
  busy1: Subscription;
  form: FormGroup;
  sbForm: FormGroup;

  tenencia: any;

  observation: any;
  errorObservation: string;

  documentos: any= [];
  condicionViviendas: any= [];

  servicioBasico: any;

  aguaOptionSI: any= [];
  aguaOptionNO: any= [];
  sanitarioOptionSI: any= [];
  sanitarioOptionNO: any= [];
  energiaOptionSI: any= [];
  energiaOptionNO: any= [];
  cocinarOptionSI: any= [];
  cocinarOptionNO: any= [];
  telecomOptionSI: any= [];
  telecomOptionNO: any= [];

  showViviendaReside: boolean = false;
  showHacinamiento: boolean = false;
  showPhotos: boolean = false;

  bgClass: string;
  errors: any= [];

  URL_PHOTO: string;

  constructor(
      private tenenciaService: TenenciaService,
      private route: ActivatedRoute,
      private router: Router,
      private fb: FormBuilder,
      private modalService: NgbModal,
      private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.inscription = this.route.params.subscribe((params: any) => {
       this.registerId = params['id'];

        this.busy = this.tenenciaService.getTenenciaByRegisterId(this.registerId).subscribe(
            data => {
                    this.tenencia = this.tenenciaService.tenencia;
                    this.servicioBasico = this.tenenciaService.servicioBasico;
                    this.observation = this.tenenciaService.observation;
                    this.condicionViviendas = UtilsService.getEvaluacionesById(RegisterService.selectedProject.tipoProyId, UtilsService.HACINAMIENTO);

                    this.documentos = this.tenenciaService.documentos;
                    this.aguaOptionSI = this.tenenciaService.tipoServicios.filter(item => item.parent == 1 && item.grupo == 1);
                    this.aguaOptionNO = this.tenenciaService.tipoServicios.filter(item => item.parent == 1 && item.grupo == 0);
                    this.sanitarioOptionSI = this.tenenciaService.tipoServicios.filter(item => item.parent == 2 && item.grupo == 1);
                    this.sanitarioOptionNO = this.tenenciaService.tipoServicios.filter(item => item.parent == 2 && item.grupo == 0);
                    this.energiaOptionSI = this.tenenciaService.tipoServicios.filter(item => item.parent == 3 && item.grupo == 1);
                    this.energiaOptionNO = this.tenenciaService.tipoServicios.filter(item => item.parent == 3 && item.grupo == 0);
                    this.cocinarOptionSI = this.tenenciaService.tipoServicios.filter(item => item.parent == 4 && item.grupo == 1);
                    this.cocinarOptionNO = this.tenenciaService.tipoServicios.filter(item => item.parent == 4 && item.grupo == 0);
                    this.telecomOptionSI = this.tenenciaService.tipoServicios.filter(item => item.parent == 5 && item.grupo == 1);
                    this.telecomOptionNO = this.tenenciaService.tipoServicios.filter(item => item.parent == 5 && item.grupo == 0);

                    // this.aguas = this.tenenciaService.tipoServicios;
                    this.setParameters();
                    this.setParametersServicioBasico();
            }, error => {
               this.router.navigate(['login']);
              }
            );

            this.showViviendaReside = UtilsService.showComponente(RegisterService.selectedProject.tipoProyId, UtilsService.viviendaResideActualmente);
            this.showHacinamiento = UtilsService.showComponente(RegisterService.selectedProject.tipoProyId, UtilsService.HACINAMIENTO);
            this.URL_PHOTO = UtilsService.PATH_PRINT;           
      });
      
      this.showPhotos = true;
      if(RegisterService.selectedProject.yearId == 2019) {        
        this.showPhotos = false;
      }
  }

  setParameters() {
    if (this.tenencia.tipoDocumentoPropiedad.id) this.tenencia.tipoDocumentoPropiedad = this.documentos.find(obj => obj.id == this.tenencia.tipoDocumentoPropiedad.id);
    if(this.showHacinamiento)
      this.tenencia.condicion = UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.HACINAMIENTO, this.tenencia.condicion);
    this.form = this.fb.group(this.tenencia);
  }

  setParametersServicioBasico() {
    if (this.servicioBasico.tipoAgua.id) { this.servicioBasico.tipoAgua = this.findServicioBasicoByid(this.servicioBasico.tipoAgua.id); }
    if (this.servicioBasico.tipoSanitario.id) { this.servicioBasico.tipoSanitario = this.findServicioBasicoByid(this.servicioBasico.tipoSanitario.id); }
    if (this.servicioBasico.tipoEnergia.id) { this.servicioBasico.tipoEnergia = this.findServicioBasicoByid(this.servicioBasico.tipoEnergia.id); }
    if (this.servicioBasico.tipoCocinar.id) { this.servicioBasico.tipoCocinar = this.findServicioBasicoByid(this.servicioBasico.tipoCocinar.id); }
    if (this.servicioBasico.tipoTelecomunicacion.id) { this.servicioBasico.tipoTelecomunicacion = this.findServicioBasicoByid(this.servicioBasico.tipoTelecomunicacion.id); }
    this.sbForm = this.fb.group(this.servicioBasico);
  }

  findServicioBasicoByid(id: number) {
    return this.tenenciaService.tipoServicios.find(obj => obj.id == id);
  }

  saveTenencia(tenencia: any) {
    this.resetError();
    tenencia.titularId = RegisterService.personIdSelected;
    // tenencia.urbano = RegisterService.selectedProject.urbano;
    console.log(tenencia);
    // if(tenencia.id == 0){
          this.busy = this.tenenciaService.saveTenencia(tenencia)
                              .subscribe(
                                ten => {
                                  this.tenencia = ten;
                                  this.setParameters();
                                  this.openMsgForm('Datos correctamente GUARDADOS', 'MENSAJE!!', 'bg-success');
                                },
                                errors => {
                                    if (errors === UtilsService.ERROR) {
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
   // }else{
  //    this.editTenencia(tenencia);
  //  }
  }

  editTenencia(tenencia: any): void {
  /*  this.busy = this.tenenciaService.updateTenencia(tenencia)
                    .subscribe(
                      ten => {this.tenencia = ten;},
                      errors => {
                          if(Array.isArray(errors)){
                              UtilsService.setFormGroupErrors(this.sbForm, errors);
                          }else if(errors == UtilsService.ERROR){
                              //this.openFormLogin(errors);
                          }else{
                            alert(errors);
                          }
                          console.log(errors);
                        }
                    );*/
  }

  saveServicioBasico(servicioBasico: any): void {
    this.resetError();
    console.log('servicio basico');
    console.log(servicioBasico);
    servicioBasico.titularId = RegisterService.personIdSelected;
    this.busy1 = this.tenenciaService.saveServicioBasico(servicioBasico)
    .subscribe(
      data => {
        this.servicioBasico = data;
        // if (servicioBasico.id === 0) {
          // this.router.navigate(['project', RegisterService.selectedProject.id, 'list'], { queryParams: { regid: this.registerId } });
        // }else {
          this.setParametersServicioBasico();
          this.openMsgForm('Datos correctamente GUARDADOS', 'MENSAJE!!', 'bg-success');
        // }
      },
      errors => {
              if (errors === UtilsService.ERROR) {
                this.utilsService.openFormLogin(errors);
              }else {
                    if (Array.isArray(errors)) {
                      UtilsService.setFormGroupErrors(this.sbForm, errors);
                      this.notifyError(errors, 'bg-danger');
                    }else {
                      this.openMsgForm(errors, 'ERROR!', 'bg-danger');
                    }
              }
              console.log(errors);
          }
    );
  }

  onChangeDomicilio(event) {
    let uploadFile = event.srcElement.files[0];
    this.tenenciaService.uploadImgDomicilio(uploadFile, 282).subscribe(
      res => console.log('OK'),
      error => console.log(error)
    );
    console.log(event);
  }

  onChangeFamily(event) {
    const uploadFile = event.srcElement.files[0];
    this.tenenciaService.uploadImgFamily(uploadFile, this.registerId).subscribe(
      res => console.log('OK'),
      error => console.log(error)
    );
    console.log(event);
  }

  saveObservation() {
    this.errorObservation = '';
    this.busy1 = this.tenenciaService.saveObservation(this.observation).subscribe(
      res => this.errorObservation = 'Observación Correctamente Guardado.',
      error => this.errorObservation = error
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

  private notifyError(msg: any, cls: string) {
    this.errors = msg;
    this.bgClass = cls;
  }
  private resetError() {
    this.errors = null;
  }

  ngOnDestroy() {
    this.inscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['project', this.registerId, 'domicilio']);
  }

}
