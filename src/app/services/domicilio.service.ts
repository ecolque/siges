import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UtilsService } from './utils.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { RegisterService } from './register.service';
import { HttpRequest, HttpClient } from '@angular/common/http';

@Injectable()
export class DomicilioService {
  public static domicilio: any;
  public static zonas: any= [];
  static caracteristica: any;
  public static respaldos: any = [];
  registerId: number;

  constructor(
    private http: Http,
    private https: HttpClient
  ) {}

  public static getCaracteristicas(categorias: any) {
    if (categorias) {
      this.caracteristica.list.forEach(obj => {
        obj.categoria = categorias.find(cat => cat.id == obj.categoria.id);
      });
    }
    return this.caracteristica;
  }
 
  public static getZonaByObj(obj: any) {
    if (obj.id > 0) {
      return this.zonas.find(zona => zona.id == obj.id);
    }else {
      return obj;
    }
  }

  getDomicilioByRegisterId(id: number): Observable<any[]> {
      if (this.registerId != id) {
        DomicilioService.domicilio = null;
        this.registerId = id;
        return this.http.get(UtilsService.domicilioBaseUrl + id)
                .map(UtilsService.extractData)
                .do(data => {
                    DomicilioService.domicilio = data.domicilio;
                    DomicilioService.zonas = data.zonas;
                    DomicilioService.caracteristica = data.caracteristica;
                    DomicilioService.respaldos =  data.tipoRespaldos;
                  })
                .catch(UtilsService.handleError);
      }else {
         return Observable.of(DomicilioService.domicilio);
      }
  }

   newDomicilio(domicilio: any): Observable<any[]> {
      return this.http.post(UtilsService.domicilioBaseUrl, domicilio)
            .map(UtilsService.extractData)
            .do(data => {
                DomicilioService.domicilio = data;
                RegisterService.setPuntajeToRegisters(data.registerId, data.puntaje, data.estado);
              })
            .catch(UtilsService.handleError);
    }

    updateDomicilio(domicilio: any): Observable<any[]> {
      return this.http.put(UtilsService.domicilioBaseUrl + domicilio.id, domicilio)
            .map(UtilsService.extractData)
            .do(data => {
              DomicilioService.domicilio = data;
              RegisterService.setPuntajeToRegisters(data.registerId, data.puntaje, data.estado);
            })
            .catch(UtilsService.handleError);
    }

    saveCaracteristicas(obj: any) {
      return this.http.post(UtilsService.domicilioBaseUrl + 'saveCaracteristica', obj)
      .map(UtilsService.extractData)
      .do(data => {
          RegisterService.setPuntajeToRegisters(data.registerId, data.puntaje, data.estado);
        })
      .catch(UtilsService.handleError);
    }

    uploadFile(file: FormData) {
      let newRequest = new HttpRequest('POST',
        UtilsService.domicilioBaseUrl + 'uploadDocument', 
        file, 
        {reportProgress: true, responseType: 'text'}
      );
      return this.https.request(newRequest);
      //console.log(data);     
      // let headers = new Headers();
      // headers.append('Content-Type','multipart/form-data');
      // headers.append('Accept','application/json');
      // let options = new RequestOptions({ headers: headers});   
      // return this.http.post(UtilsService.domicilioBaseUrl + 'uploadDocument', file); 
    }
    deleteFileRespaldo(registerId: number, respaldoId: number, nameFile: string){
      return this.http.get(UtilsService.domicilioBaseUrl + 'deleteFileRespaldo/' + registerId + '/' + respaldoId + '/' + nameFile)
      .map(UtilsService.extractData)
      .do(data => {})
      .catch(UtilsService.handleError);
    }

    /*deleteFamily(id:number, idx:number): Observable<any[]>{
    return this.http.delete(UtilsService.familyBaseUrl+id)
          .map(UtilsService.extractData)
          .do(data => this.families.splice(idx, 1))
          .catch(UtilsService.handleError);
    }*/

    /*getAgregateById(id: number): Promise<any> {
      if(id > 0)
        return Promise.resolve(this.agregates).then(registers => this.agregates.find(agregate => agregate.id === id));
      else
      return Promise.resolve({id:0,name:""});
    } */
}
