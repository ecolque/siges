
import { element } from 'protractor';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';

// import { ErrorService} from './../shared/utils/error.service';

// import { LoginComponent } from './../login/login.component';
import { LoginPopupComponent } from './../login/login.popup.component';


@Injectable()
export class UtilsService implements OnInit {

  /* ENUM evaluaciones */
  public static gradoInstruccion: number = 1;
  public static responsableHogar: number = 3;
  public static gradoDiscapacidad: number = 6;
  public static HACINAMIENTO: number = 7;
  public static aportePatronal: number = 9;
  public static caracteristicaVivienda: number = 10;
  public static serviciosBasicos: number = 11;
  public static viviendaResideActualmente: number = 12;
  public static CREDITO: number = 13;

  // public static condicionVivienda: number = 4;
  /* END ENUM */

  /* ENUM ACCESSES */
  public static OPEN_REGISTERS: number = 1;
  public static OPEN_PROJECT: number = 2;
  public static READ_ONLY: number = 4;
  public static CHANGE_HOLDER: number = 5;
  public static REPORTS: number = 6;
  public static SEARCH: number = 7;
  public static MANAGMENT: number = 8;
  public static SSP: number = 9;
  public static REPORTS_BY_PROJECTS: number = 10;
  /* END ENUM ACCESSES */

  // dataRequiredRegisterService:any;
  private static projects: any[] = [];
  private static treeProjects: any[] = [];
  private static genders: any[] = [];
  private static tipoFamilias: any[] = [];
  private static actividadEconomicas: any[] = [];
  // private static levelInstructions:any[]=[];
  private static maritalStatus: any[]= [];
  // public municipalities:any[] = [];
  private static municipalities: any[] = [];
  private static departamentos: any[] = [];
  private static provincias: any[] = [];
  private static typeDocuments: any[] = [];
  private static parentescos: any = [];
  private static evaluaciones: any = [];
  private static tipoProyEvaluaciones: any = [];
  private static tipoDiscapacidades: any = [];
  private static register: any;


  private static URBANO: string = 'URABANO';
  private static RURAL: string = 'RURAL';
  private static URBANO_RURAL: string = 'URBANO/RURAL';

  
  // private static SERVER = 'http://10.10.0.102:8082/';
  // private static SERVER_2 = 'http://10.10.0.102:8082/rub/rub/main';
  //private static SERVER = "http://192.168.10.58:8080/";
  //private static SERVER = "http://10.10.0.159:80/";
  private static SERVER = 'http://siges.aevivienda.gob.bo/';
  private static SERVER_2 = 'http://siges.aevivienda.gob.bo/rub/rub/main';

  private static baseUrl: string = UtilsService.SERVER + 'siges/';
  public static baseUrl_2: string = UtilsService.SERVER_2;
  public static PATH_PRINT: string = UtilsService.SERVER;
  public static PATH_PHOTOS: string = 'http://siges.aevivienda.gob.bo/sigesUpload/public/';

  public static authenticateBaseUrl: string = UtilsService.baseUrl + 'authService/authenticate/';
  public static changepassBaseUrl: string = UtilsService.baseUrl + 'authService/';
  public static authWhenInvalidateSessionBaseUrl: string = UtilsService.baseUrl + 'authService/authInvalidateSession/';
  public static logoutBaseUrl: string = UtilsService.baseUrl + 'authService/logout/';

  public static registerBaseUrl: string = UtilsService.baseUrl + 'registerService/';
  public static familyBaseUrl: string = UtilsService.baseUrl + 'familyService/';
  public static domicilioBaseUrl: string = UtilsService.baseUrl + 'domicilioService/';
  public static tenenciaBaseUrl: string = UtilsService.baseUrl + 'tenenciaService/';
  public static geoBaseUrl: string = UtilsService.baseUrl + 'sspService/';
  public static mapBaseUrl: string = UtilsService.baseUrl + 'mapService/';
  private dataRequiredRegisterBaseUrl: string = UtilsService.baseUrl + 'dataRequiredService/register/';
  public static documentoBaseUrl: string = UtilsService.baseUrl + 'documentoService/';

  public static localityBaseUrl: string = UtilsService.baseUrl + 'localityService/';
  public static dataRequiredAgricolaBaseUrl: string = UtilsService.baseUrl + 'dataRequiredService/agricola/';
  public static dataRequiredPecuariaBaseUrl: string = UtilsService.baseUrl + 'dataRequiredService/pecuaria/';
  public static agricolaBaseUrl: string = UtilsService.baseUrl + 'agricolaService/';
  public static pecuariaBaseUrl: string = UtilsService.baseUrl + 'pecuariaService/';
  public static pecuariaSubProductoBaseUrl: string = UtilsService.baseUrl + 'pecuariaSubproductoService/';
  public static agricolaDetalleBaseUrl: string = UtilsService.baseUrl + 'agricolaDetalleService/';

  public static ERROR: string = 'logout';
  public static USER: any;

  constructor(private http: Http,  private modalService: NgbModal  ) {
   /* console.log("UtilsService constructor");
    this.getDataRequiredRegisterService().subscribe((data)=>{
        UtilsService.genders = data["genders"];
        UtilsService.typeDocuments = data["typeDocuments"];
        UtilsService.register = data["register"];
        this.municipalities = data["municipalities"];
        UtilsService.typePersons = data["typePersons"];
        console.log("***constructor utils service");
        console.log(data);
        console.log("***END constructor utils service");
    });*/
  }

  ngOnInit(): void {
    // ErrorService.openEmmitter.subscribe(res => {/*this.openFormLogin(this.loginPopupComponent);*/ console.log("OPEN " + res)});
  }

  /*getDataRequiredRegisterService(): Observable<any[]> {
      return this.http.get(this.dataRequiredRegisterBaseUrl)
              .map(UtilsService.extractData)
              .do(data => {
                  UtilsService.genders = data["genders"];
                  UtilsService.typeDocuments = data["typeDocuments"];
                  UtilsService.register = data["register"];
                  this.municipalities = data["municipalities"];
                  UtilsService.typePersons = data["typePersons"];
                  console.log("***constructor utils service");
                  console.log(data);
                  console.log("***END constructor utils service");
              })
              .catch(UtilsService.handleError);
  }*/

  searchDocument(document: string, searchSegip: boolean, day: number, month: number, year: number) {
    let params = 'searchDocument/' + document + '/' + searchSegip + '/' + day + '/' + month + '/' + year;
    return this.http.get(UtilsService.registerBaseUrl + params)
        .map(UtilsService.extractData)
        .do(data => { })
        .catch(UtilsService.handleError);
  }

  public static setDataRequired(data: any) {
        /*UtilsService.genders = data["genders"];
        UtilsService.typeDocuments = data["typeDocuments"];
        UtilsService.register = data["register"];
        UtilsService.municipalities = data["municipalities"];
        UtilsService.typePersons = data["typePersons"]; */

        UtilsService.genders = data.genders;
        UtilsService.tipoFamilias = data.tipoFamilias;
        UtilsService.actividadEconomicas = data.actividadEconomicas;
        // UtilsService.levelInstructions = data.levelInstructions;
        UtilsService.maritalStatus = data.maritalStatus;
        UtilsService.municipalities = data.municipalities;
        UtilsService.departamentos = data.departamentos;
        UtilsService.provincias = data.provincias;
        UtilsService.projects = data.projects;
        UtilsService.treeProjects = data.treeProjects;
        UtilsService.register = data.register;
        UtilsService.typeDocuments = data.typeDocuments;
        UtilsService.parentescos = data.typeParentescos;
        UtilsService.evaluaciones = data.evaluaciones;
        UtilsService.tipoProyEvaluaciones = data.tipoProyEvaluaciones;
        UtilsService.tipoDiscapacidades = data.tipoDiscapacidades;
        UtilsService.USER = data.user;
        console.log('***constructor utils service');
        console.log(data);
        console.log('***END constructor utils service');
  }

  public static getTreeProjects() {
    return this.treeProjects;
  }

  public static getProjects() {
    return this.projects;
  }
 // public static getLevelInstruccions(){
   // return this.levelInstructions;
  // }

  public static getMaritalStatus() {
    return this.maritalStatus;
  }

  public static getMunicipalities() {
    return this.municipalities;
  }

  public static getDepartamentos() {
    return this.departamentos;
  }

  public static getProvincias() {
    return this.provincias;
  }

  public static getTypeDocumentsByShowTitular(show: boolean) {
    if (show) {
      return this.typeDocuments;
    }else {
      return this.typeDocuments.filter(_ => _.showTitular === true);
    }
  }

  public static getGenders() {
    return this.genders;
  }

  public static getGenderById(id: number) {
      return this.genders.find(gender => gender.id == id);
  }

  public static getTipoFamilias() {
    return this.tipoFamilias;
  }

  public static getTipoFamiliasByObj(obj: any) {
    if (obj.id > 0) {
      return this.tipoFamilias.find(tipo => tipo.id == obj.id);
    }else {
      return obj;
    }
  }

  public static getActividadEconomicas() {
    return this.actividadEconomicas;
  }

  public static getactividadEconomicasByObj(obj: any) {
    console.log('get activities');
    console.log(obj);
     if (obj.id > 0) {
        return this.actividadEconomicas.find(act => act.id == obj.id);
      }
     return obj;
  }
  /*public static getLevelInstructionsById(id:number){
      return this.levelInstructions.find(level => level.id == id);
  }*/

  public static getMaritalStatusById(id: number) {
      return this.maritalStatus.find(obj => obj.id == id);
  }

  public static getTypeDocumentById(id: number) {
      return this.typeDocuments.find(typeDocument => typeDocument.id == id);
  }

  public static getDepartamentosById(id: number) {
      return this.departamentos.find(obj => obj.id == id);
  }

  public static getProvinciasById(id: number) {
      return this.provincias.find(obj => obj.id == id);
  }

  public static getProvinciasByDepartmentId(id: number) {
    return this.provincias.filter(obj => obj.departamentoId == id);
  }

  public static getParentescosById(id: number) {
      return this.parentescos.find(parentesco => parentesco.id == id);
  }

  public static getParentescos() {
    return this.parentescos;
  }

  public static getEvaluacionesById(tipoProyId: number, variableId: number) {
      let evaluacionId = this.getTipoProyByEvaluacionIdAndVariableId(tipoProyId, variableId);
      if (evaluacionId > 0) {
        return this.evaluaciones.find(evaluacion => evaluacion.id == evaluacionId && evaluacion.variableId == variableId).categorias;
      }
      return null;
  }

  public static getCategoriasByObj(tipoProyId: number, varId: number, obj: any) {
    if (obj.id > 0) {
      let list = this.getEvaluacionesById(tipoProyId, varId);
      let res;
      if (list) {
        res = list.find(cat => cat.id == obj.id);
      }
      if (res) {
        return res;
      }
      return obj;
    }else {
      return obj;
    }
  }

  public static getTipoDiscapacidades() {
    return this.tipoDiscapacidades;
  }
  public static getTipoDiscapacidadesByObj(obj: any) {
      if (obj.id > 0) {
        return this.tipoDiscapacidades.find(tipo => tipo.id == obj.id);
      }else {
        return obj;
      }
  }

  // realiza la consulta para ver si el componente sera visible
  public static showComponente(tipoProyId: number, variableId: number) {
    let evaluacionId = this.getTipoProyByEvaluacionIdAndVariableId(tipoProyId, variableId);
    if (evaluacionId) {
      return true;
    }
    return false;
  }

  public static getObjRegister() {
    return this.register;
  }

  public static extractData(res: Response) {    
    let data = res.json();
    return data || { };
  }

  public static handleError (error: Response | any) {
    // console.log(error._body.toString());
    let errMsg: string;
    errMsg = error._body ? error._body : error.toString();
    // return Observable.throw(errMsg.toString());
    // return Observable.throw(JSON.parse(errMsg));
   /* if(this.isJson(errMsg))
       return Observable.throw(JSON.parse(errMsg));
    else
      return Observable.throw(errMsg);*/
    // console.log(error._body);
    try {
        JSON.parse(errMsg);
    } catch (e) {
        return Observable.throw(errMsg);
    }
    return Observable.throw(JSON.parse(errMsg));
   /* console.log(error);
    let errMsg: string;
    if (error instanceof Response) {
      console.error("Response");
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
      console.error("NO Response");
    }
    return Observable.throw(errMsg);*/
  }

  public static setFormGroupErrors(form: FormGroup, errors: any) {
      errors.forEach(elem => {
        console.log(elem);
        form.controls[elem.control].setErrors({msg: elem.msg, type: elem.type});
      });
      form.setErrors(errors);
  }

  private static getTipoProyByEvaluacionIdAndVariableId(tipoProyId: number, variableId: number) {
    let res = this.tipoProyEvaluaciones.find(obj => obj.tipoProyId == tipoProyId && obj.variableId == variableId);
    if (res) {
      return res.evaluacionId;
    }
    return 0;
  }

  public static isAcceses(param: number) {    
    for(let i = 0; i < this.USER['acceses'].length; i++){
      if(param === this.USER['acceses'][i]){
        return true;
      }
    }
    return false;
  }

  public openFormLogin(error: any) {
    if (error == UtilsService.ERROR) {
      const modalRef = this.modalService.open(LoginPopupComponent, {size: 'sm', keyboard: false, backdrop: 'static'});
      modalRef.result.then((result) => {
        if (result) {
          console.log(result);
        }
      });
    }
  }
}