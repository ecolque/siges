import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UtilsService } from './utils.service';
import { RegisterService } from './register.service';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class TenenciaService {
  tenencia: any;
  servicioBasico: any;
  observation: any;
  registerId: number = 0;

  tipoServicios: any= [];
  documentos: any= [];

  constructor(
    private http: Http,
  ) {}

   getTenenciaByRegisterId(id: number): Observable<any[]> {
      if (this.registerId != id) {
        this.registerId = id;
        return this.http.get(UtilsService.tenenciaBaseUrl + id)
                .map(UtilsService.extractData)
                .do(data => {
                    // this.dataServer = data;
                    this.tenencia = data.tenencia;
                    this.documentos = data.documentos;
                    this.servicioBasico = data.servicioBasico;
                    this.tipoServicios = data.tipoServicios;
                    this.observation = data.observation;
                    console.log(data);
                }).catch(UtilsService.handleError);
      }else {
         return Observable.of(this.tenencia);
      }
  }

   saveTenencia(tenencia: any): Observable<any[]> {
      return this.http.post(UtilsService.tenenciaBaseUrl, tenencia)
            .map(UtilsService.extractData)
            .do(data => {
              this.tenencia = data;
              RegisterService.setPuntajeToRegisters(data.registerId, data.puntaje, data.estado);
              })
            .catch(UtilsService.handleError);
    }

    saveServicioBasico(servicioBasico: any): Observable<any[]> {
      return this.http.post(UtilsService.tenenciaBaseUrl + 'saveServicioBasico', servicioBasico)
            .map(UtilsService.extractData)
            .do(data => {
              this.servicioBasico = data;
              RegisterService.setPuntajeToRegisters(data.registerId, data.puntaje, data.estado);
              })
            .catch(UtilsService.handleError);
    }

    saveObservation(obs: any): Observable<any[]> {
      return this.http.post(UtilsService.tenenciaBaseUrl + 'saveObservation', obs)
            .map(UtilsService.extractData)
            .do(data => {
              // this.servicioBasico = data;
              })
            .catch(UtilsService.handleError);
    }

    uploadImgDomicilio(file, id) {
      console.log('uploadImgDomicilio');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('id', id);
      return this.http.post(UtilsService.tenenciaBaseUrl + 'upload', fd, id)
                .map(UtilsService.extractData)
                .do(data => console.log(data))
                .catch(UtilsService.handleError);
    }

    uploadImgFamily(file, id) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('id', id);
      return this.http.post(UtilsService.tenenciaBaseUrl + 'uploadImgFamily', fd, id)
                .map(UtilsService.extractData)
                .do(data => console.log(data))
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
