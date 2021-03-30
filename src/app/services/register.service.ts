import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { UtilsService } from './utils.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';



@Injectable()
export class RegisterService {
  public static registers: any[];
  public static pages: number;
  public static pageIndex: number = 0;
  public static params: SearchParams;

  static selectedProject: any;
  static personIdSelected: number;
  static selectedStateId: number;
  // static selectedRegister:any;
  static isSelectedProject: boolean = false;

  people: any[];

  @Output() registerSelectedEmitter: EventEmitter<any> = new EventEmitter();
  @Output() projectSelectedEmitter: EventEmitter<any> = new EventEmitter();

  // baseUrl: string;
  constructor(
    private http: Http,
    private utilsService: UtilsService
  ) {
       this.people = [
            {id: 5, name: 'edwin', fname: 'colque', lname: 'Mamani', brithLocality: {id: 1, name: 'cinco'}},
            {id: 1, name: 'juan', fname: 'Otors', lname: 'otros', brithLocality: {id: 1, name: 'juan'}},
            {id: 2, name: 'pedro pedro', fname: 'pedrp', lname: 'pedrp', brithLocality: {id:1, name: 'pedro'}},
            {id: 3, name: 'Oscar', brithLocality: {id: 1, name: 'oscar'}},
            {id: 4, name: 'Juan 4', brithLocality: {id: 1, name: 'juan'}}
        ];
        // this.baseUrl = "http://localhost:8080/runafServer/serv/registerService/";
        RegisterService.params = new SearchParams('', '', '');
  }

  getRegisters(projectId: number, page: number, limit: number): Observable<any[]> {
      this.registerSelectedEmitter.emit(null);
      let params = projectId + '/' + page + '/' + limit;
      return this.http.get(UtilsService.registerBaseUrl + params)
              .map(UtilsService.extractData)
              .do(data => { RegisterService.registers = data.registers; RegisterService.pages = data.pages; console.log('+++ RegisterService getRegisters'); console.log(data); })
              .catch(UtilsService.handleError);
  }

  getTreeProject(typeTree: number, idSearch: number) {
    let params = 'getTreeProject/' + typeTree + '/' + idSearch;
    return this.http.get(UtilsService.registerBaseUrl + params)
    .map(UtilsService.extractData)
    .do(data => { })
    .catch(UtilsService.handleError);
  }

  validateSegip(projectId: number, page: number, limit: number): Observable<any[]> {
    this.registerSelectedEmitter.emit(null);
    let params = 'validateSegip/' + projectId + '/' + page + '/' + limit;
    return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { RegisterService.registers = data.registers; RegisterService.pages = data.pages; console.log('+++ RegisterService getRegisters'); console.log(data); })
            .catch(UtilsService.handleError);
 }

  verificarBeneficios(projectId: number, page: number, limit: number): Observable<any[]> {
      this.registerSelectedEmitter.emit(null);
      let params = 'verficarBeneficio/' + projectId + '/' + page + '/' + limit;
      return this.http.get(UtilsService.registerBaseUrl + params)
              .map(UtilsService.extractData)
              .do(data => { RegisterService.registers = data.registers; RegisterService.pages = data.pages; console.log('+++ RegisterService getRegisters'); console.log(data); })
              .catch(UtilsService.handleError);
  }
 
  getDetalleObservaciones(projectId: number, registerId: number, document: string, personId: number): Observable<any[]> {
    let params = 'getDetalleObs/' + projectId + '/' + registerId + '/' + document + '/' + personId;
    return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
  }

  getFuncionarios(personId: number, paterno: string, materno: string, document: string) {
    let params = 'getFuncionarios/' + personId + '/' + paterno + '/' + materno + '/' + document;
    return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
  }

  saveFuncionarios(personId: number, causal: string) {
    let params = 'saveFuncionarios/' + personId + '/' + causal;
    return this.http.post(UtilsService.registerBaseUrl + 'saveFuncionarios', {id: personId, name: causal})
        .map(UtilsService.extractData)
        .do(data => {
          // RegisterService.registers.find(register => register.person.id === data).person.employee = true;
        })
        .catch(UtilsService.handleError);
  }
 
  getRenuncia(registerId: number) {
    let params = 'getRenuncia/' + registerId;
    return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
  }

newRegister(register: any): Observable<any[]> {
      return this.http.post(UtilsService.registerBaseUrl, register)
            .map(UtilsService.extractData)
            .do(data => {
               if (!RegisterService.registers) {
                   RegisterService.registers = [];
                }
                RegisterService.registers.splice(0, 0, data);
                // this.registerSelectedEmitter.emit(JSON.parse(JSON.stringify(data)));
                this.registerSelectedEmitter.emit(data);
                // console.log(data);
              })
            .catch(UtilsService.handleError);
}

updateRegister(register: any): Observable<any[]> {
  return this.http.put(UtilsService.registerBaseUrl + register.id, register)
        .map(UtilsService.extractData)
        .do(data => {
            let idx = RegisterService.registers.findIndex(reg => reg.id === data.id);
            RegisterService.registers.splice(idx, 1);
            RegisterService.registers.splice(idx, 0, data);
            // this.registerSelectedEmitter.emit(JSON.parse(JSON.stringify(data)));
            this.registerSelectedEmitter.emit(data);
            console.log(data);
        })
        .catch(UtilsService.handleError);
}

getPersonById(id: number) {
  let params = 'getPersonById/' + id;
  return this.http.get(UtilsService.registerBaseUrl + params)
  .map(UtilsService.extractData)
  .do(data => { })
  .catch(UtilsService.handleError);
}

getRecord(registerId: number, personId: number) {
  let params = 'getRecord/' + registerId+"/"+personId;
  return this.http.get(UtilsService.registerBaseUrl + params)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

pregips(registerId: number) {
  let params = 'sendAndGetRegisterPregips/' + registerId;
  return this.http.get(UtilsService.baseUrl_2+'/' + params)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

public getRegisterById(id: number): Promise<any> {
  let register = this._getRegisterByid(id);
  register.then(reg =>  this.registerSelectedEmitter.emit(reg));
  return register;
}

public static setPuntajeAndBeneficiosToRegisters(registerId: number, puntaje: number, estado: any, aev: any, pvs: any, ueve: any, titulacion: any, tresxmil: any) {
  let obj = RegisterService.registers.find(_ => _.id == registerId);
  obj.puntaje = puntaje;
  obj.estado = estado;
  obj.aev = aev;
  obj.pvs = pvs;
  obj.ueve = ueve;
  obj.tresxmil = tresxmil;
  obj.titulacion = titulacion;
  return obj;
}


public static setPuntajeToRegisters(registerId: number, puntaje: number, estado: any) {
  let obj = RegisterService.registers.find(_ => _.id == registerId);
  obj.puntaje = puntaje;
  obj.estado = estado;
  return obj;
}

private _getRegisterByid(id: number): Promise<any> {
  if (id > 0 && RegisterService.registers) {
    return  Promise.resolve(RegisterService.registers).then(registers => RegisterService.registers.find(register => register.id === id));
  }else {
    let reg = JSON.parse(JSON.stringify(UtilsService.getObjRegister()));
    reg.proyectoId = RegisterService.selectedProject.id;
    return  Promise.resolve(reg);
  }
}

// CERRAR Y ABRIR LISTAS
closeInicialProject(obj: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'closeInicialProject', obj)
  .map(UtilsService.extractData)
  .do(data => { })
  .catch(UtilsService.handleError);
}

closeProject(obj: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'closeProject', obj)
  .map(UtilsService.extractData)
  .do(data => { })
  .catch(UtilsService.handleError);
}

openProject(openRegister: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'openProject', openRegister)
  .map(UtilsService.extractData)
  .do(data => { })
  .catch(UtilsService.handleError);
}

saveCloseRegisterObs(obj: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'saveCloseRegisterObs', obj)
  .map(UtilsService.extractData)
  .do(data => { })
  .catch(UtilsService.handleError);
}
// FIN CERRAR Y ABRIR LISTAS

// CERRAR Y ABRIR REGISTROS
closeInicialRegister(list: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'closeInicialRegister', list)
  .map(UtilsService.extractData)
  .do(data => {})
  .catch(UtilsService.handleError);
}

closeRegister(list: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'closeRegister', list)
  .map(UtilsService.extractData)
  .do(data => { })
  .catch(UtilsService.handleError);
}

openRegistersInicial(openRegister: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'openRegistersInicial', openRegister)
    .map(UtilsService.extractData)
    .do(data => { })
    .catch(UtilsService.handleError);
}

openRegisters(openRegister: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'openRegisters', openRegister)
    .map(UtilsService.extractData)
    .do(data => { })
    .catch(UtilsService.handleError);
}
// FIN CERRAR Y ABRIR REGISTROS

cancelRenuncia(reuncia: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'cancelRenuncia', reuncia)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

renunciar(reuncia: any) {
  return this.http.post(UtilsService.registerBaseUrl + 'renunciar', reuncia)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

cambioEstado(registerId: number) {
  let params = 'cambioEstado/' + registerId;
  return this.http.get(UtilsService.registerBaseUrl + params)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

guardarReemplazo(registerId: number, reemplazoId: number, estadoId: number) {
  let params = 'guardarReemplazo/' + registerId + '/' + reemplazoId + '/' + estadoId;
  return this.http.get(UtilsService.registerBaseUrl + params)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

cancelReemplazo(registerId: number, reemplazoId: number, estadoId: number) {
  let params = 'cancelReemplazo/' + registerId + '/' + reemplazoId + '/' + estadoId;
  return this.http.get(UtilsService.registerBaseUrl + params)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

autorizarBeneficio(obj: any) {
  let params = 'saveAutorizaBeneficio';
  return this.http.post(UtilsService.registerBaseUrl + params, obj)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

uploadImg(file, id) {
      let fd = new FormData();
      fd.append('file', file);
      fd.append('id', id);
      return this.http.post(UtilsService.registerBaseUrl + 'uploadImg', fd, id)
                .map(UtilsService.extractData)
                .do(data => console.log(data))
                .catch(UtilsService.handleError);
}

deleteRegister(id: number, idx: number): Observable<any[]> {
  return this.http.delete(UtilsService.registerBaseUrl + id)
        .map(UtilsService.extractData)
        .do(data => { RegisterService.registers.splice(idx, 1); this.registerSelectedEmitter.emit(null); })
        .catch(UtilsService.handleError);
}
recorteRegister(id: number): Observable<any[]> {
    return this.http.get(UtilsService.registerBaseUrl + 'recorte/' + id)
          .map(UtilsService.extractData)
          .do(data => { })
          .catch(UtilsService.handleError);
}

  /**cretidos */
  getCreditoEstados(projectId:number, registerId: number) {
    let params = 'getCreditoEstados/' + projectId + '/'+ registerId;
    return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
  }

  updateCreditoEstado(state: any) {    
    return this.http.post(UtilsService.registerBaseUrl + 'updateCreditoEstado', state)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
  }
  desistirCredito(state: any) {
    return this.http.post(UtilsService.registerBaseUrl + 'desistirCredito', state)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
  }
  saveEntityAndOficialByRegisterId(registerId: number, obj: any) {
    return this.http.put(UtilsService.registerBaseUrl + 'saveEntityAndOficialByRegisterId/' + registerId, obj)
    .map(UtilsService.extractData)
    .do(data => { })
    .catch(UtilsService.handleError);
  }
  asignarInmueble(registerId: number, obj:any) {
    return this.http.put(UtilsService.registerBaseUrl + 'asignarInmueble/' + registerId, obj)
    .map(UtilsService.extractData)
    .do(data => { })
    .catch(UtilsService.handleError);
  }
  /**end cretidos */

  public openFormLogin(error: any) {
    this.utilsService.openFormLogin(error);
  }

 /* getPeopleByRegisterId(registerId:number){
    return this.people;
  }*/

 /* private extractData(res: Response) {
    let data = res.json();
    return data || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    errMsg = error._body ? error._body : error.toString();
    return Observable.throw(errMsg.toString());
  }*/
}

class SearchParams {
  constructor(private name: string, private code: string, private document: string) { }
}
