

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from './../../services/utils.service';

import { FormBuilder, FormGroup  } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { RegisterService } from './../../services/register.service';
import { Subscription } from 'rxjs/subscription';
import { PersonSimilarComponent } from './person-similar/person-similiar.component';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-config';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  @Input() person: any;
  @Input() activeFamilyForm: boolean;
  @Input() disabled: boolean;
  @Input('activeFormGroup') form: FormGroup;
  @Output() savePerson: EventEmitter<any> = new EventEmitter();
  @Output() cancelPerson: EventEmitter<any> = new EventEmitter();

  busy: Subscription;

  genders: any;
  tipoFamilias: any;
  typeDocuments: any;
  respFamilias: any;
  parentescos: any;
  estadoCiviles: any;
  docExpediciones: any;
  levelInstruccions: any;
  tipoDiscapacidades: any;
  actividadEconomicas: any;
  gradoDiscapacidades: any;

  deptNacs: any;
  provNacs: any;

  // urbano:boolean;
  metrica: number;
  labelDisabled: boolean = true;

  today: any;

  constructor(
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private registerService: RegisterService,
    private fb: FormBuilder,
    private config: NgbDatepickerConfig
  ) {
    this.today = new Date();
    config.minDate = {year: (this.today.getFullYear() - 120), month: 1, day: 1};
    config.maxDate = {year: this.today.getFullYear(), month: (this.today.getMonth() + 1), day: this.today.getDate()};
  }

  ngOnInit() {
    this.setParameters();
  }

  setParameters() {
    this.genders = UtilsService.getGenders();
    this.typeDocuments = UtilsService.getTypeDocumentsByShowTitular(this.activeFamilyForm);
    this.docExpediciones = UtilsService.getDepartamentos();
    this.deptNacs = UtilsService.getDepartamentos();
    this.searchProvincias();

    this.tipoDiscapacidades = UtilsService.getTipoDiscapacidades();
    this.actividadEconomicas = UtilsService.getActividadEconomicas();
    this.estadoCiviles = UtilsService.getMaritalStatus();        
    
    // es un parche que se debe corregir
    if(RegisterService.selectedProject.yearId >= 2019) {
      this.gradoDiscapacidades = [];      
      this.gradoDiscapacidades.splice(0, 0, {id: 62, name: "Discapacidad (SI)"});
    }

    if(RegisterService.selectedProject.yearId <= 2018) {
      //this.gradoDiscapacidades = [];      
      this.gradoDiscapacidades = UtilsService.getEvaluacionesById(RegisterService.selectedProject.tipoProyId, UtilsService.gradoDiscapacidad);
      this.gradoDiscapacidades.splice(0, 1);
    }
    // fin del parche    
            
    if (this.gradoDiscapacidades && !this.gradoDiscapacidades.find(obj => obj.id == 0)) {
      this.gradoDiscapacidades.splice(0, 0, {id: 0, name: null});
    }
    this.levelInstruccions = UtilsService.getEvaluacionesById(RegisterService.selectedProject.tipoProyId, UtilsService.gradoInstruccion);
    if (this.levelInstruccions && !this.levelInstruccions.find(obj => obj.id == 0)) {
      this.levelInstruccions.splice(0, 0, {id: 0, name: null});
    }

    if (this.activeFamilyForm) {
        this.parentescos = UtilsService.getParentescos();
        this.labelDisabled = false;
    }else {
      this.tipoFamilias = UtilsService.getTipoFamilias();
      if (!this.tipoFamilias.find(obj => obj.id == 0)) {
          this.tipoFamilias.splice(0, 0, {id: 0, name: null});
        }
      this.respFamilias = UtilsService.getEvaluacionesById(RegisterService.selectedProject.tipoProyId, UtilsService.responsableHogar);
      if (this.respFamilias && !this.respFamilias.find(obj => obj.id == 0)) {
          this.respFamilias.splice(0, 0, {id: 0, name: null});
        }
    }

    // this.urbano = false;
    // this.urbano = RegisterService.selectedProject.urbano;
    this.metrica = RegisterService.selectedProject.metricaId;
    if (this.person.id) {
      this.labelDisabled = false;
    }
    console.log(this.form);
  }

  onSubmit(person) {
    console.log(person);
    this.savePerson.emit(person.value);
  }

  error: any;
  searchDNI() {
    this.error = null;
    let document = this.form.get('document').value;
    let fnac = this.form.get('fnac').value;
    console.log(fnac);
    if (document != null && document != '' && (!this.searchSegip || (fnac.year != 0 && fnac.month != 0 && fnac.day != 0)) )  {
      this.busy = this.utilsService.searchDocument(document, this.searchSegip, fnac.day, fnac.month, fnac.year)
      .subscribe(
        data => {
          if (data && data.length == 1 && data[0].procede && data[0].beneficio == 'SEGIP') {
            this.form.patchValue({
                  nombres: data.nombres,
                  paterno: data.paterno,
                  materno: data.materno,
                  fnac: data.fnac,
                  complemento: data.complemento
            });
          }else {
              this.openSimilarPerson(data);
          }
          console.log(data);
        },errors => {
              if (Array.isArray(errors)) {
                  UtilsService.setFormGroupErrors(this.form, errors);
              }else if (errors == UtilsService.ERROR) {
                this.registerService.openFormLogin(errors);
              }else {
                if (errors == 'ok') {
                  this.form.get('document').setErrors({msg: 'Proceda al Registro Manual, No se encontraron datos.'});
                  this.labelDisabled = false;
                }else {
                  this.error = errors;
                }
              }                                                                                                  

          console.log(errors);
        }
      );
    }else {
      if(document == null || document == '') {
        this.form.get('document').setErrors({msg: 'Este campo es Requerido.'});
      }

      if(fnac.year <= 0 || fnac.month <= 0 || fnac.day <= 0){
        this.form.get('fnac').setErrors({msg: 'Este campo es Requerido.'});
      }
      
    }
    console.log(document);
  }

  public _cancelPerson() {
    this.cancelPerson.emit(null);
  }

  changePerentesco(parentesco: any) {
    if (parentesco && parentesco.id == 2) {
      // PersonComponent.activeComponentConyugueForm = true;
    }else {
      // PersonComponent.activeComponentConyugueForm = false;
    }
  }

  lastDocument: string;
  controlChangeDocument() {
    this.labelDisabled = false;
    if (!this.activeFamilyForm) {
      let document = this.form.get('document').value;
      if (this.lastDocument != document) {
        this.form.get('nombres').setValue('');
        this.form.get('paterno').setValue('');
        this.form.get('materno').setValue('');
        this.form.get('especial').setValue('');
        this.form.get('fnac').setValue({year: 0, month: 0, day: 0});
        console.log(document);
        this.lastDocument = document;
      }
    }
  }

  searchProvincias() {
    let deptNac = this.form.get("deptNac").value;
    console.log(deptNac.id);
    if (deptNac.id > 0) {
      this.provNacs = UtilsService.getProvinciasByDepartmentId(deptNac.id);
      console.log(this.provNacs);
    }else {
      this.provNacs = [];
    }
  }

  searchSegip: boolean;
  clickSearchSegip() {
    this.searchSegip = !this.searchSegip;
  }

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  }

  private openSimilarPerson(people: any) {
    const modalRef = this.modalService.open(PersonSimilarComponent, {size: 'lg', backdrop: 'static', keyboard: false});
    modalRef.componentInstance.people = people;
    modalRef.result.then((person) => {
        if (person) {
          this.lastDocument = person.document;
            if (person.getDatos) { 
              this.busy = this.registerService.getPersonById(person.id).subscribe(
                data => {
                  this.form.patchValue({
                    id: data.id,
                    nombres: data.nombres,
                    paterno: data.paterno,
                    materno: data.materno,
                    especial: data.especial,
                    fnac: data.fnac,
                    complemento: data.complementoVisible ? person.complemento : '',
                    tipoDoc: UtilsService.getTypeDocumentById(data.tipoDoc.id),
                    expedido: UtilsService.getDepartamentosById(data.expedido.id),
                    tipoDiscapacidad:  UtilsService.getTipoDiscapacidadesByObj(data.tipoDiscapacidad),
                    gradoDiscapacidad: UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.gradoDiscapacidad, data.gradoDiscapacidad),
                    grado: UtilsService.getCategoriasByObj(RegisterService.selectedProject.tipoProyId, UtilsService.gradoInstruccion, data.grado),
                    estadoCivil: UtilsService.getMaritalStatusById(data.estadoCivil.id),
                    genero: UtilsService.getGenderById(data.genero.id),
                    munNac: data.munNac,
                    ingreso: data.ingreso,
                    certMedDiscapacidad: data.certMedDiscapacidad,
                    certOrgDiscapacidad: data.certOrgDiscapacidad,
                    ciDiscapacidad: data.ciDiscapacidad
                  });
                }, error => {
                  this.error = error;
              });
            }else {
              this.form.patchValue({
                    nombres: person.nombres,
                    paterno: person.paterno,
                    materno: person.materno,
                    especial: person.especial,
                    fnac: person.fnac,
                    complemento: person.complementoVisible ? person.complemento : '',
                    segipId: person.segipId
              });
           }
        }
    });
  }

  formatter = (x: {name: string}) => x.name;
  search = (text$: Observable<string>) => text$.debounceTime(200).map(term => term === '' ? [] : UtilsService.getMunicipalities().filter(v => new RegExp(term, 'gi').test(v.name)).slice(0, 10));
}
