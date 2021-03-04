import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseOptions  } from '@angular/http';
import { Observable } from 'rxjs';
import { UtilsService } from './../services/utils.service';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class SearchService {

    constructor(
        private http: Http,
// private utilsService: UtilsService
        ) { }

    findByDni(dni: string): Observable<any[]> {
        let params = 'findByDni/' + dni;
        return this.http.get(UtilsService.registerBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }
    
    findByNames(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'findByNames', obj)
        .map(UtilsService.extractData)
        .do(data => {})
        .catch(UtilsService.handleError);
    }

    findCorteElectoral(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'findCorteElectoral', obj)
        .map(UtilsService.extractData)
        .do(data => {})
        .catch(UtilsService.handleError);
    }

    findPvs(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'findPvs', obj)
        .map(UtilsService.extractData)
        .do(data => {})
        .catch(UtilsService.handleError);
    }

    findTitulacion(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'findTitulacion', obj)
        .map(UtilsService.extractData)
        .do(data => {})
        .catch(UtilsService.handleError);
    }

    findTresxmil(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'findTresxmil', obj)
        .map(UtilsService.extractData)
        .do(data => {})
        .catch(UtilsService.handleError);
    }

    findAev(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'findAev', obj)
        .map(UtilsService.extractData)
        .do(data => {})
        .catch(UtilsService.handleError);
    }

    download(obj: any): Observable<any[]> {
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(UtilsService.PATH_PRINT + 'dwCertificate', obj, options)
        // .map(UtilsService.extractData)
        .do(data => {
            console.log(data);
            window.open(data.url);
        })
        .catch(UtilsService.handleError);
    }
}

