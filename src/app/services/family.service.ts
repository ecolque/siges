import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UtilsService } from './utils.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { RegisterService } from './register.service';
import { RegisterListComponent } from './../register/register-list/register-list.component';



@Injectable()
export class FamilyService {
  families: any[]= [];
  ingreso: any;
  credito: any;
  registerId: number;

  constructor(
    private http: Http
  ) { }

   getFamiliesByRegisterId(registerId: number, titularId: number, credito: boolean): Observable<any[]> {
      /*if(this.registerId != id){
        this.registerId = id;*/
        this.families = [];
        this.ingreso = null;
        return this.http.get(UtilsService.familyBaseUrl + registerId + '/' + titularId+ '/' + credito)
                .map(UtilsService.extractData)
                .do(data => {
                  this.families = data.families;
                  this.ingreso = data.ingreso;
                  this.credito = data.credito;
                })
                .catch(UtilsService.handleError);
     /* }else{
         return Observable.of(this.families);
      }*/
  }

  validateSegip(registerId: number, titularId: number): Observable<any[]> {
      return this.http.get(UtilsService.familyBaseUrl + 'validateSegip/' + registerId + '/' + titularId)
          .map(UtilsService.extractData)
          .do(data => {
            this.families = data.families;
            this.ingreso = data.ingreso;
          })
          .catch(UtilsService.handleError);
  }

   newFamily(family: any): Observable<any[]> {
      return this.http.post(UtilsService.familyBaseUrl, family)
            .map(UtilsService.extractData)
            .do(data => {
              if (!this.families) {
                   this.families = [];
              }
              this.families.splice(0, 0, data);
                RegisterService.setPuntajeAndBeneficiosToRegisters(data.registerId, data.puntaje, data.estado, data.aev, data.pvs, data.ueve, data.titulacion, data.tresxmil);
              })
            .catch(UtilsService.handleError);
    }

    updateFamily(fam: any): Observable<any[]> {
      return this.http.put(UtilsService.familyBaseUrl + fam.id, fam)
            .map(UtilsService.extractData)
            .do(data => {
                let idx = this.families.findIndex(family => family.id === data.id);
                this.families.splice(idx, 1);
                this.families.splice(idx, 0, data);
                RegisterService.setPuntajeAndBeneficiosToRegisters(data.registerId, data.puntaje, data.estado, data.aev, data.pvs, data.ueve, data.titulacion, data.tresxmil);
            })
            .catch(UtilsService.handleError);
    }

  deleteFamily(id: number, idx: number, registerId: number): Observable<any[]> {
    return this.http.delete(UtilsService.familyBaseUrl + id + '/' + registerId)
          .map(UtilsService.extractData)
          .do(data => {
                console.log(data);
                this.families.splice(idx, 1);
                RegisterService.setPuntajeToRegisters(data.registerId, data.puntaje, data.estado);
            })
          .catch(UtilsService.handleError);
  }

  saveIngreso(ingreso: any): Observable<any[]> {
    return this.http.post(UtilsService.familyBaseUrl + 'saveIngreso', ingreso)
          .map(UtilsService.extractData)
          .do(data => {
            this.ingreso = data;
            console.log(this.ingreso);
            RegisterService.setPuntajeToRegisters(data.registerId, data.puntaje, data.estado);
            })
          .catch(UtilsService.handleError);
  }

  /*getAgregateById(id: number): Promise<any> {
    if(id > 0)
      return Promise.resolve(this.agregates).then(registers => this.agregates.find(agregate => agregate.id === id));
    else
     return Promise.resolve({id:0,name:""});
  } */
}
